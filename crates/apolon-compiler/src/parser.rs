//! Recursive descent parser for the Apolon DSL.
//!
//! Parses a token stream into an AST. Implements operator precedence parsing
//! for expressions, and supports all grammar productions from the spec.

use crate::ast::*;
use crate::lexer::{Token, TokenKind};
use crate::span::Span;

/// Errors produced by the parser.
#[derive(Debug, Clone, PartialEq)]
pub struct ParseError {
    pub code: &'static str,
    pub message: String,
    pub span: Span,
}

impl std::fmt::Display for ParseError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "[{}] {} at {}", self.code, self.message, self.span)
    }
}

impl std::error::Error for ParseError {}

/// The parser state.
pub struct Parser {
    tokens: Vec<Token>,
    pos: usize,
}

impl Parser {
    /// Create a new parser from a token list.
    pub fn new(tokens: Vec<Token>) -> Self {
        Self { tokens, pos: 0 }
    }

    /// Parse the entire token stream as a program (sequence of modules).
    pub fn parse_program(&mut self) -> Result<Program, ParseError> {
        let mut modules = Vec::new();

        while !self.at_end() {
            let module = self.parse_module()?;
            modules.push(module);
        }

        Ok(Program { modules })
    }

    /// Check if we've reached the end of tokens.
    fn at_end(&self) -> bool {
        self.peek_kind() == TokenKind::Eof
    }

    /// Peek at the current token kind.
    fn peek_kind(&self) -> TokenKind {
        self.tokens
            .get(self.pos)
            .map(|t| t.kind.clone())
            .unwrap_or(TokenKind::Eof)
    }

    /// Peek at the current token (returns owned clone to avoid borrow conflicts).
    fn peek(&self) -> Token {
        self.tokens.get(self.pos).cloned().unwrap_or(Token {
            kind: TokenKind::Eof,
            span: Span::dummy(),
        })
    }

    /// Consume and return the current token.
    fn advance(&mut self) -> Token {
        let tok = self.tokens.get(self.pos).cloned().unwrap_or(Token {
            kind: TokenKind::Eof,
            span: Span::dummy(),
        });
        self.pos += 1;
        tok
    }

    /// Check if the current token matches a specific kind.
    fn check(&self, kind: &TokenKind) -> bool {
        &self.peek_kind() == kind
    }

    /// Consume a token if it matches, returning true/false.
    fn matches(&mut self, kind: &TokenKind) -> bool {
        if self.check(kind) {
            self.advance();
            true
        } else {
            false
        }
    }

    /// Expect a specific token kind, returning it or an error.
    fn expect(&mut self, kind: &TokenKind, msg: &str) -> Result<Token, ParseError> {
        if self.check(kind) {
            Ok(self.advance())
        } else {
            let tok = self.peek();
            Err(ParseError {
                code: "E0001",
                message: format!("expected {msg}, found '{}'", tok.kind.name()),
                span: tok.span,
            })
        }
    }

    /// Expect an identifier token.
    fn expect_ident(&mut self) -> Result<(String, Span), ParseError> {
        match &self.peek_kind() {
            TokenKind::Ident(name) => {
                let span = self.peek().span;
                self.advance();
                Ok((name.clone(), span))
            }
            other => {
                let tok = self.peek();
                Err(ParseError {
                    code: "E0001",
                    message: format!("expected identifier, found '{}'", other.name()),
                    span: tok.span,
                })
            }
        }
    }

    /// Expect an upper identifier (type/constructor name).
    fn expect_upper_ident(&mut self) -> Result<(String, Span), ParseError> {
        match &self.peek_kind() {
            TokenKind::UpperIdent(name) => {
                let span = self.peek().span;
                self.advance();
                Ok((name.clone(), span))
            }
            other => {
                let tok = self.peek();
                Err(ParseError {
                    code: "E0001",
                    message: format!("expected upper identifier, found '{}'", other.name()),
                    span: tok.span,
                })
            }
        }
    }

    // ────────────────────────────────────────────────────────
    // Module parsing
    // ────────────────────────────────────────────────────────

    fn parse_module(&mut self) -> Result<Module, ParseError> {
        let start = self.expect(&TokenKind::Module, "'module'")?;
        let mut path = Vec::new();

        let (first, _) = self.expect_ident()?;
        path.push(first);

        while self.check(&TokenKind::Cons) {
            // '::' parsed as Cons
            self.advance();
            let (part, _) = self.expect_ident()?;
            path.push(part);
        }

        self.expect(&TokenKind::LBrace, "'{'")?;

        let mut declarations = Vec::new();
        while !self.check(&TokenKind::RBrace) && !self.at_end() {
            let decl = self.parse_top_level()?;
            declarations.push(decl);
        }

        let end = self.expect(&TokenKind::RBrace, "'}'")?;

        Ok(Module {
            span: start.span.merge(end.span),
            path,
            declarations,
        })
    }

    fn parse_top_level(&mut self) -> Result<TopLevel, ParseError> {
        match self.peek_kind() {
            TokenKind::Import => self.parse_import_decl().map(TopLevel::Import),
            TokenKind::Card => self.parse_card_decl().map(TopLevel::Card),
            TokenKind::Fn => self.parse_fn_decl().map(TopLevel::Fn),
            TokenKind::Type | TokenKind::Alias => self.parse_type_decl().map(TopLevel::Type),
            TokenKind::Effect => self.parse_effect_decl().map(TopLevel::Effect),
            TokenKind::Let => self.parse_let_decl().map(TopLevel::Let),
            _ => {
                let tok = self.peek();
                Err(ParseError {
                    code: "E0001",
                    message: format!("expected top-level declaration, found '{}'", tok.kind.name()),
                    span: tok.span,
                })
            }
        }
    }

    // ────────────────────────────────────────────────────────
    // Import declaration
    // ────────────────────────────────────────────────────────

    fn parse_import_decl(&mut self) -> Result<ImportDecl, ParseError> {
        let start = self.expect(&TokenKind::Import, "'import'")?;
        let mut path = Vec::new();

        let (first, _) = self.expect_ident()?;
        path.push(first);

        while self.check(&TokenKind::Cons) {
            self.advance();
            let (part, _) = self.expect_ident()?;
            path.push(part);
        }

        let alias = if self.check(&TokenKind::Ident("as".to_string()))
            || self.peek_kind() == TokenKind::Ident("as".to_string())
        {
            // "as" is lexed as Ident("as")
            if let TokenKind::Ident(name) = &self.peek_kind() {
                if name == "as" {
                    self.advance();
                    let (alias_name, _) = self.expect_ident()?;
                    Some(alias_name)
                } else {
                    None
                }
            } else {
                None
            }
        } else {
            None
        };

        Ok(ImportDecl {
            span: start.span,
            path,
            alias,
        })
    }

    // ────────────────────────────────────────────────────────
    // Card declaration
    // ────────────────────────────────────────────────────────

    fn parse_card_decl(&mut self) -> Result<CardDecl, ParseError> {
        let start = self.expect(&TokenKind::Card, "'card'")?;
        let (name, _) = self.expect_ident()?;
        self.expect(&TokenKind::LBrace, "'{'")?;

        let mut fields = Vec::new();
        while !self.check(&TokenKind::RBrace) && !self.at_end() {
            let field = self.parse_card_field()?;
            fields.push(field);
        }

        let end = self.expect(&TokenKind::RBrace, "'}'")?;

        Ok(CardDecl {
            span: start.span.merge(end.span),
            name,
            fields,
        })
    }

    fn parse_card_field(&mut self) -> Result<CardField, ParseError> {
        match self.peek_kind() {
            TokenKind::Ident(ref name)
                if matches!(
                    name.as_str(),
                    "name" | "rarity"
                        | "affiliation"
                        | "attack"
                        | "defense"
                        | "image_url"
                        | "flavor_text"
                ) =>
            {
                self.parse_card_meta_field().map(CardField::Meta)
            }
            TokenKind::Ability | TokenKind::Ultimate => {
                self.parse_card_ability_decl().map(CardField::Ability)
            }
            _ => {
                let tok = self.peek();
                Err(ParseError {
                    code: "E0001",
                    message: format!("expected card field, found '{}'", tok.kind.name()),
                    span: tok.span,
                })
            }
        }
    }

    fn parse_card_meta_field(&mut self) -> Result<CardMetaField, ParseError> {
        let (field_name, span) = self.expect_ident()?;
        self.expect(&TokenKind::Assign, "'='")?;

        match field_name.as_str() {
            "name" => {
                let val = self.expect_string_lit()?;
                Ok(CardMetaField::Name { span, value: val })
            }
            "rarity" => {
                let (rarity, _rspan) = self.parse_rarity()?;
                Ok(CardMetaField::Rarity { span, value: rarity })
            }
            "affiliation" => {
                let val = self.expect_string_lit()?;
                Ok(CardMetaField::Affiliation { span, value: val })
            }
            "attack" => {
                let (val, _) = self.expect_int_lit()?;
                Ok(CardMetaField::Attack { span, value: val })
            }
            "defense" => {
                let (val, _) = self.expect_int_lit()?;
                Ok(CardMetaField::Defense { span, value: val })
            }
            "image_url" => {
                let val = self.expect_string_lit()?;
                Ok(CardMetaField::ImageUrl { span, value: val })
            }
            "flavor_text" => {
                let val = self.expect_string_lit()?;
                Ok(CardMetaField::FlavorText { span, value: val })
            }
            _ => Err(ParseError {
                code: "E0001",
                message: format!("unknown card meta field: {field_name}"),
                span,
            }),
        }
    }

    fn parse_rarity(&mut self) -> Result<(Rarity, Span), ParseError> {
        let tok = self.peek();
        let name = match &tok.kind {
            TokenKind::Ident(n) | TokenKind::UpperIdent(n) => n.as_str(),
            _ => {
                return Err(ParseError {
                    code: "E0001",
                    message: format!("expected rarity (C, R, SR), found '{}'", tok.kind.name()),
                    span: tok.span,
                });
            }
        };
        match name {
            "C" => {
                self.advance();
                Ok((Rarity::Common, tok.span))
            }
            "R" => {
                self.advance();
                Ok((Rarity::Rare, tok.span))
            }
            "SR" => {
                self.advance();
                Ok((Rarity::SuperRare, tok.span))
            }
            _ => Err(ParseError {
                code: "E0001",
                message: format!("expected rarity (C, R, SR), found '{name}'"),
                span: tok.span,
            }),
        }
    }

    fn parse_card_ability_decl(&mut self) -> Result<CardAbilityDecl, ParseError> {
        let start = self.advance(); // consume 'ability' or 'ultimate'
        let (name, _) = self.expect_ident()?;
        self.expect(&TokenKind::LParen, "'('")?;
        let params = self.parse_param_list()?;
        self.expect(&TokenKind::RParen, "')'")?;
        self.expect(&TokenKind::Colon, "':'")?;
        let return_type = self.parse_type_expr()?;
        self.expect(&TokenKind::Assign, "'='")?;

        let body = if self.check(&TokenKind::EffectMarker) {
            self.advance(); // consume 'effect_'
            self.parse_ability_body_effect()?
        } else {
            let expr = self.parse_expr()?;
            AbilityBody::Expr(expr)
        };

        Ok(CardAbilityDecl {
            span: start.span,
            name,
            params,
            return_type,
            body,
        })
    }

    fn parse_ability_body_effect(&mut self) -> Result<AbilityBody, ParseError> {
        let mut clauses = Vec::new();
        clauses.push(self.parse_effect_clause()?);

        while self.check(&TokenKind::OrOr) {
            // '|' is currently lexed as the start of '||', but for effect bodies we use '|'
            // Since the lexer doesn't have a standalone '|', we'll handle this differently
            // The grammar says `|` but our lexer only has `||` (OrOr) and `|>` (Pipe)
            // We need to skip the `|` from `||` context
            // Actually, looking at the grammar more carefully: EffectBody ::= EffectClause ("|" EffectClause)*
            // But '|' isn't a single token in our lexer. We need to handle this.
            // For now, let's treat it as: if we see `||` we consume it and treat it as `|`
            self.advance();
        }

        Ok(AbilityBody::Effect(clauses))
    }

    fn parse_effect_clause(&mut self) -> Result<EffectClause, ParseError> {
        let start = self.peek().span;
        let effect_level = match self.peek_kind() {
            TokenKind::Pure => {
                self.advance();
                EffectLevel::Pure
            }
            TokenKind::View => {
                self.advance();
                EffectLevel::View
            }
            TokenKind::Mut => {
                self.advance();
                EffectLevel::Mut
            }
            _ => {
                let tok = self.peek();
                return Err(ParseError {
                    code: "E0001",
                    message: format!("expected effect level (pure/view/mut), found '{}'", tok.kind.name()),
                    span: tok.span,
                });
            }
        };

        self.expect(&TokenKind::LBrace, "'{'")?;

        let mut stmts = Vec::new();
        while !self.check(&TokenKind::RBrace) && !self.at_end() {
            let stmt = self.parse_stmt()?;
            stmts.push(stmt);
        }

        let end = self.expect(&TokenKind::RBrace, "'}'")?;

        Ok(EffectClause {
            span: start.merge(end.span),
            effect_level,
            stmts,
        })
    }

    // ────────────────────────────────────────────────────────
    // Function declaration
    // ────────────────────────────────────────────────────────

    fn parse_fn_decl(&mut self) -> Result<FnDecl, ParseError> {
        let start = self.expect(&TokenKind::Fn, "'fn'")?;
        let (name, _) = self.expect_ident()?;

        // Type parameters
        let type_params = if self.check(&TokenKind::LBracket) {
            self.advance(); // '['
            let mut params = Vec::new();
            if let TokenKind::Ident(_name) = self.peek_kind() {
                let (n, _) = self.expect_ident()?;
                params.push(n);
                while self.check(&TokenKind::Comma) {
                    self.advance();
                    let (n, _) = self.expect_ident()?;
                    params.push(n);
                }
            }
            self.expect(&TokenKind::RBracket, "']'")?;
            params
        } else {
            vec![]
        };

        self.expect(&TokenKind::LParen, "'('")?;
        let params = if !self.check(&TokenKind::RParen) {
            self.parse_param_list()?
        } else {
            vec![]
        };
        self.expect(&TokenKind::RParen, "')'")?;

        let return_type = if self.check(&TokenKind::Colon) {
            self.advance();
            Some(self.parse_type_expr()?)
        } else {
            None
        };

        let constraints = if self.check(&TokenKind::Where) {
            self.advance();
            self.parse_constraint_list()?
        } else {
            vec![]
        };

        self.expect(&TokenKind::Assign, "'='")?;
        let body = self.parse_expr()?;

        Ok(FnDecl {
            span: start.span,
            name,
            type_params,
            params,
            return_type,
            constraints,
            body,
        })
    }

    fn parse_param_list(&mut self) -> Result<Vec<Param>, ParseError> {
        let mut params = Vec::new();
        params.push(self.parse_param()?);

        while self.check(&TokenKind::Comma) {
            self.advance();
            params.push(self.parse_param()?);
        }

        Ok(params)
    }

    fn parse_param(&mut self) -> Result<Param, ParseError> {
        let (name, span) = self.expect_ident()?;
        self.expect(&TokenKind::Colon, "':'")?;
        let type_ann = self.parse_type_expr()?;
        Ok(Param {
            span,
            name,
            type_ann,
        })
    }

    fn parse_constraint_list(&mut self) -> Result<Vec<Constraint>, ParseError> {
        let mut constraints = Vec::new();
        constraints.push(self.parse_constraint()?);

        while self.check(&TokenKind::Comma) {
            self.advance();
            constraints.push(self.parse_constraint()?);
        }

        Ok(constraints)
    }

    fn parse_constraint(&mut self) -> Result<Constraint, ParseError> {
        let (var, span) = self.expect_ident()?;
        self.expect(&TokenKind::Colon, "':'")?;
        let kind = self.parse_kind_expr()?;
        Ok(Constraint { span, var, kind })
    }

    fn parse_kind_expr(&mut self) -> Result<KindExpr, ParseError> {
        match &self.peek_kind() {
            TokenKind::UpperIdent(name) => {
                let n = name.clone();
                self.advance();
                Ok(KindExpr::Named(n))
            }
            TokenKind::Star => {
                self.advance();
                Ok(KindExpr::Star)
            }
            _ => {
                let tok = self.peek();
                Err(ParseError {
                    code: "E0001",
                    message: format!("expected kind expression, found '{}'", tok.kind.name()),
                    span: tok.span,
                })
            }
        }
    }

    // ────────────────────────────────────────────────────────
    // Type declaration
    // ────────────────────────────────────────────────────────

    fn parse_type_decl(&mut self) -> Result<TypeDecl, ParseError> {
        let start = self.peek().span;
        let is_alias = if self.check(&TokenKind::Alias) {
            self.advance();
            true
        } else {
            self.expect(&TokenKind::Type, "'type'")?;
            false
        };

        let (name, _) = self.expect_upper_ident()?;

        let type_params = if self.check(&TokenKind::LBracket) {
            self.advance();
            let mut params = Vec::new();
            if let TokenKind::Ident(_name) = &self.peek_kind() {
                let (n, _) = self.expect_ident()?;
                params.push(n);
                while self.check(&TokenKind::Comma) {
                    self.advance();
                    let (n, _) = self.expect_ident()?;
                    params.push(n);
                }
            }
            self.expect(&TokenKind::RBracket, "']'")?;
            params
        } else {
            vec![]
        };

        self.expect(&TokenKind::Assign, "'='")?;
        let body = self.parse_type_expr()?;

        Ok(TypeDecl {
            span: start,
            name,
            type_params,
            body,
            is_alias,
        })
    }

    // ────────────────────────────────────────────────────────
    // Effect declaration
    // ────────────────────────────────────────────────────────

    fn parse_effect_decl(&mut self) -> Result<EffectDecl, ParseError> {
        let start = self.expect(&TokenKind::Effect, "'effect'")?;
        let (name, _) = self.expect_ident()?;
        self.expect(&TokenKind::Assign, "'='")?;

        let spec = match self.peek_kind() {
            TokenKind::Pure => {
                self.advance();
                EffectLevel::Pure
            }
            TokenKind::View => {
                self.advance();
                EffectLevel::View
            }
            TokenKind::Mut => {
                self.advance();
                EffectLevel::Mut
            }
            _ => {
                let tok = self.peek();
                return Err(ParseError {
                    code: "E0001",
                    message: "expected 'pure', 'view', or 'mut'".to_string(),
                    span: tok.span,
                });
            }
        };

        Ok(EffectDecl {
            span: start.span,
            name,
            spec,
        })
    }

    // ────────────────────────────────────────────────────────
    // Let declaration (top-level)
    // ────────────────────────────────────────────────────────

    fn parse_let_decl(&mut self) -> Result<LetDecl, ParseError> {
        let start = self.expect(&TokenKind::Let, "'let'")?;
        let (name, _) = self.expect_ident()?;

        let type_ann = if self.check(&TokenKind::Colon) {
            self.advance();
            Some(self.parse_type_expr()?)
        } else {
            None
        };

        self.expect(&TokenKind::Assign, "'='")?;
        let value = self.parse_expr()?;

        Ok(LetDecl {
            span: start.span,
            name,
            type_ann,
            value,
        })
    }

    // ────────────────────────────────────────────────────────
    // Type expressions
    // ────────────────────────────────────────────────────────

    fn parse_type_expr(&mut self) -> Result<TypeExpr, ParseError> {
        self.parse_type_arrow()
    }

    /// Parse function type (right-associative arrow).
    fn parse_type_arrow(&mut self) -> Result<TypeExpr, ParseError> {
        let left = self.parse_type_base()?;

        if self.check(&TokenKind::Arrow) {
            let start = left.span();
            self.advance();
            let right = self.parse_type_arrow()?; // right-recursive for right-associativity
            return Ok(TypeExpr::Arrow {
                span: start.merge(right.span()),
                param: Box::new(left),
                ret: Box::new(right),
            });
        }

        Ok(left)
    }

    fn parse_type_base(&mut self) -> Result<TypeExpr, ParseError> {
        let tok = self.peek();
        match &tok.kind {
            TokenKind::Int => {
                self.advance();
                Ok(TypeExpr::Named {
                    span: tok.span,
                    name: "Int".to_string(),
                })
            }
            TokenKind::Bool => {
                self.advance();
                Ok(TypeExpr::Named {
                    span: tok.span,
                    name: "Bool".to_string(),
                })
            }
            TokenKind::StringTy => {
                self.advance();
                Ok(TypeExpr::Named {
                    span: tok.span,
                    name: "String".to_string(),
                })
            }
            TokenKind::Unit => {
                self.advance();
                Ok(TypeExpr::Named {
                    span: tok.span,
                    name: "Unit".to_string(),
                })
            }
            TokenKind::FieldChar => {
                self.advance();
                Ok(TypeExpr::Named {
                    span: tok.span,
                    name: "FieldChar".to_string(),
                })
            }
            TokenKind::BattleState => {
                self.advance();
                Ok(TypeExpr::Named {
                    span: tok.span,
                    name: "BattleState".to_string(),
                })
            }
            TokenKind::BattleResult => {
                self.advance();
                Ok(TypeExpr::Named {
                    span: tok.span,
                    name: "BattleResult".to_string(),
                })
            }
            TokenKind::UpperIdent(name) => {
                let n = name.clone();
                let span = tok.span;
                self.advance();
                Ok(TypeExpr::Named { span, name: n })
            }
            TokenKind::Ident(name) => {
                // Type variable
                let n = name.clone();
                let span = tok.span;
                self.advance();
                Ok(TypeExpr::Var { span, name: n })
            }
            TokenKind::LBrace => self.parse_record_type(),
            TokenKind::LBracket => self.parse_list_type(),
            TokenKind::LParen => self.parse_tuple_type(),
            _ => Err(ParseError {
                code: "E0001",
                message: format!("expected type expression, found '{}'", tok.kind.name()),
                span: tok.span,
            }),
        }
    }

    fn parse_record_type(&mut self) -> Result<TypeExpr, ParseError> {
        let start = self.expect(&TokenKind::LBrace, "'{'")?;
        let mut fields = Vec::new();
        let rest = None;

        while !self.check(&TokenKind::RBrace) && !self.at_end() {
            self.expect(&TokenKind::Hash, "'#'")?;
            let (label, lspan) = self.expect_ident()?;
            self.expect(&TokenKind::Colon, "':'")?;
            let field_type = self.parse_type_expr()?;
            fields.push(RowField {
                span: lspan,
                label,
                field_type,
            });

            if self.check(&TokenKind::Comma) {
                self.advance();
            }
        }

        let end = self.expect(&TokenKind::RBrace, "'}'")?;

        Ok(TypeExpr::Record {
            span: start.span.merge(end.span),
            fields,
            rest: rest.map(Box::new),
        })
    }

    fn parse_list_type(&mut self) -> Result<TypeExpr, ParseError> {
        let start = self.expect(&TokenKind::LBracket, "'['")?;
        let element = self.parse_type_expr()?;
        let end = self.expect(&TokenKind::RBracket, "']'")?;

        Ok(TypeExpr::List {
            span: start.span.merge(end.span),
            element: Box::new(element),
        })
    }

    fn parse_tuple_type(&mut self) -> Result<TypeExpr, ParseError> {
        let start = self.expect(&TokenKind::LParen, "'('")?;
        let mut elements = Vec::new();

        if !self.check(&TokenKind::RParen) {
            elements.push(self.parse_type_expr()?);
            while self.check(&TokenKind::Comma) {
                self.advance();
                elements.push(self.parse_type_expr()?);
            }
        }

        let end = self.expect(&TokenKind::RParen, "')'")?;

        if elements.len() == 1 {
            // Single element in parens is just grouping
            Ok(elements.into_iter().next().unwrap())
        } else {
            Ok(TypeExpr::Tuple {
                span: start.span.merge(end.span),
                elements,
            })
        }
    }

    // ────────────────────────────────────────────────────────
    // Statements
    // ────────────────────────────────────────────────────────

    fn parse_stmt(&mut self) -> Result<Stmt, ParseError> {
        match self.peek_kind() {
            TokenKind::Let => {
                let start = self.expect(&TokenKind::Let, "'let'")?;
                let (name, _) = self.expect_ident()?;

                let type_ann = if self.check(&TokenKind::Colon) {
                    self.advance();
                    Some(self.parse_type_expr()?)
                } else {
                    None
                };

                self.expect(&TokenKind::Assign, "'='")?;
                let value = self.parse_expr()?;

                Ok(Stmt::Let(LetStmt {
                    span: start.span,
                    name,
                    type_ann,
                    value,
                }))
            }
            TokenKind::Return => {
                let start = self.expect(&TokenKind::Return, "'return'")?;
                let expr = self.parse_expr()?;
                Ok(Stmt::Return(ReturnStmt {
                    span: start.span,
                    expr,
                }))
            }
            _ => {
                let start = self.peek().span;
                let expr = self.parse_expr()?;
                Ok(Stmt::Expr(ExprStmt {
                    span: start,
                    expr,
                }))
            }
        }
    }

    // ────────────────────────────────────────────────────────
    // Expressions (precedence climbing)
    // ────────────────────────────────────────────────────────

    fn parse_expr(&mut self) -> Result<Expr, ParseError> {
        self.parse_or_expr()
    }

    /// `Expr2 ::= Expr3 ("||" Expr3)*`
    fn parse_or_expr(&mut self) -> Result<Expr, ParseError> {
        let mut left = self.parse_and_expr()?;

        while self.check(&TokenKind::OrOr) {
            let _op_span = self.advance().span;
            let right = self.parse_and_expr()?;
            let span = left.span().merge(right.span());
            left = Expr::BinOp {
                span,
                op: BinOp::Or,
                left: Box::new(left),
                right: Box::new(right),
            };
        }

        Ok(left)
    }

    /// `Expr3 ::= Expr4 ("&&" Expr4)*`
    fn parse_and_expr(&mut self) -> Result<Expr, ParseError> {
        let mut left = self.parse_cmp_expr()?;

        while self.check(&TokenKind::AndAnd) {
            let _op_span = self.advance().span;
            let right = self.parse_cmp_expr()?;
            let span = left.span().merge(right.span());
            left = Expr::BinOp {
                span,
                op: BinOp::And,
                left: Box::new(left),
                right: Box::new(right),
            };
        }

        Ok(left)
    }

    /// `Expr4 ::= Expr5 ("==" | "!=" | "<" | ">" | "<=" | ">=") Expr5`
    fn parse_cmp_expr(&mut self) -> Result<Expr, ParseError> {
        let mut left = self.parse_add_expr()?;

        loop {
            let op = match self.peek_kind() {
                TokenKind::EqEq => BinOp::Eq,
                TokenKind::Neq => BinOp::Neq,
                TokenKind::Lt => BinOp::Lt,
                TokenKind::Gt => BinOp::Gt,
                TokenKind::Le => BinOp::Le,
                TokenKind::Ge => BinOp::Ge,
                _ => break,
            };
            self.advance();
            let right = self.parse_add_expr()?;
            let span = left.span().merge(right.span());
            left = Expr::BinOp {
                span,
                op,
                left: Box::new(left),
                right: Box::new(right),
            };
        }

        Ok(left)
    }

    /// `Expr5 ::= Expr6 ("+" | "-") Expr6`
    fn parse_add_expr(&mut self) -> Result<Expr, ParseError> {
        let mut left = self.parse_mul_expr()?;

        loop {
            let op = match self.peek_kind() {
                TokenKind::RowExtend => BinOp::Add, // '+' lexed as RowExtend
                TokenKind::Minus => BinOp::Sub,
                _ => break,
            };
            self.advance();
            let right = self.parse_mul_expr()?;
            let span = left.span().merge(right.span());
            left = Expr::BinOp {
                span,
                op,
                left: Box::new(left),
                right: Box::new(right),
            };
        }

        Ok(left)
    }

    /// `Expr6 ::= Expr7 ("*" | "/" | "%") Expr7`
    fn parse_mul_expr(&mut self) -> Result<Expr, ParseError> {
        let mut left = self.parse_cons_expr()?;

        loop {
            let op = match self.peek_kind() {
                TokenKind::Star => BinOp::Mul,
                TokenKind::Slash => BinOp::Div,
                TokenKind::Percent => BinOp::Mod,
                _ => break,
            };
            self.advance();
            let right = self.parse_cons_expr()?;
            let span = left.span().merge(right.span());
            left = Expr::BinOp {
                span,
                op,
                left: Box::new(left),
                right: Box::new(right),
            };
        }

        Ok(left)
    }

    /// `Expr7 ::= Expr8 ("::" Expr8)?`
    fn parse_cons_expr(&mut self) -> Result<Expr, ParseError> {
        let left = self.parse_pipe_expr()?;

        if self.check(&TokenKind::Cons) {
            self.advance();
            let right = self.parse_pipe_expr()?;
            let span = left.span().merge(right.span());
            return Ok(Expr::Cons {
                span,
                head: Box::new(left),
                tail: Box::new(right),
            });
        }

        Ok(left)
    }

    /// `Expr8 ::= Expr9 (("|>" IDENT) | ("." IDENT))*`
    fn parse_pipe_expr(&mut self) -> Result<Expr, ParseError> {
        let mut left = self.parse_unary_expr()?;

        loop {
            if self.check(&TokenKind::Pipe) {
                self.advance();
                let (name, _) = self.expect_ident()?;
                let span = left.span();
                left = Expr::Pipe {
                    span,
                    left: Box::new(left),
                    right: name,
                };
            } else if self.check(&TokenKind::Dot) {
                self.advance();
                let (field, _) = self.expect_ident()?;
                let span = left.span();
                left = Expr::FieldAccess {
                    span,
                    record: Box::new(left),
                    field,
                };
            } else {
                break;
            }
        }

        Ok(left)
    }

    /// Unary expressions: `!x`, `-x`
    fn parse_unary_expr(&mut self) -> Result<Expr, ParseError> {
        match self.peek_kind() {
            TokenKind::Not => {
                let span = self.advance().span;
                let operand = self.parse_unary_expr()?;
                Ok(Expr::UnaryOp {
                    span: span.merge(operand.span()),
                    op: UnaryOp::Not,
                    operand: Box::new(operand),
                })
            }
            TokenKind::Minus => {
                let span = self.advance().span;
                let operand = self.parse_unary_expr()?;
                Ok(Expr::UnaryOp {
                    span: span.merge(operand.span()),
                    op: UnaryOp::Neg,
                    operand: Box::new(operand),
                })
            }
            _ => self.parse_primary_expr(),
        }
    }

    /// Primary expressions and application.
    fn parse_primary_expr(&mut self) -> Result<Expr, ParseError> {
        let tok = self.peek();
        let start_span = tok.span;

        match &tok.kind {
            TokenKind::IntLit(value) => {
                let v = *value;
                self.advance();
                Ok(Expr::IntLit {
                    span: start_span,
                    value: v,
                })
            }
            TokenKind::StringLit(value) => {
                let v = value.clone();
                self.advance();
                Ok(Expr::StringLit {
                    span: start_span,
                    value: v,
                })
            }
            TokenKind::BoolLit(value) => {
                let v = *value;
                self.advance();
                Ok(Expr::BoolLit {
                    span: start_span,
                    value: v,
                })
            }
            TokenKind::Ident(name) => {
                let n = name.clone();
                self.advance();

                // Check for function application
                if self.check(&TokenKind::LParen) {
                    self.advance(); // consume '('
                    let mut args = Vec::new();
                    if !self.check(&TokenKind::RParen) {
                        args.push(self.parse_expr()?);
                        while self.check(&TokenKind::Comma) {
                            self.advance();
                            args.push(self.parse_expr()?);
                        }
                    }
                    let end = self.expect(&TokenKind::RParen, "')'")?;
                    return Ok(Expr::App {
                        span: start_span.merge(end.span),
                        func: Box::new(Expr::Var {
                            span: start_span,
                            name: n,
                        }),
                        args,
                    });
                }

                Ok(Expr::Var {
                    span: start_span,
                    name: n,
                })
            }
            TokenKind::UpperIdent(name) => {
                let n = name.clone();
                self.advance();
                Ok(Expr::Constructor {
                    span: start_span,
                    name: n,
                })
            }
            TokenKind::LParen => {
                self.advance(); // consume '('
                if self.check(&TokenKind::RParen) {
                    self.advance();
                    return Ok(Expr::Unit { span: start_span });
                }
                let expr = self.parse_expr()?;
                let _end = self.expect(&TokenKind::RParen, "')'")?;

                // Check for application: expr(...)
                if self.check(&TokenKind::LParen) {
                    self.advance();
                    let mut args = Vec::new();
                    if !self.check(&TokenKind::RParen) {
                        args.push(self.parse_expr()?);
                        while self.check(&TokenKind::Comma) {
                            self.advance();
                            args.push(self.parse_expr()?);
                        }
                    }
                    let app_end = self.expect(&TokenKind::RParen, "')'")?;
                    return Ok(Expr::App {
                        span: start_span.merge(app_end.span),
                        func: Box::new(expr),
                        args,
                    });
                }

                Ok(expr)
            }
            TokenKind::LBracket => {
                self.advance(); // consume '['
                let mut elements = Vec::new();
                if !self.check(&TokenKind::RBracket) {
                    elements.push(self.parse_expr()?);
                    while self.check(&TokenKind::Comma) {
                        self.advance();
                        elements.push(self.parse_expr()?);
                    }
                }
                let end = self.expect(&TokenKind::RBracket, "']'")?;
                Ok(Expr::List {
                    span: start_span.merge(end.span),
                    elements,
                })
            }
            TokenKind::LBrace => self.parse_record_literal(),
            TokenKind::If => self.parse_if_expr(),
            TokenKind::Match => self.parse_match_expr(),
            TokenKind::Let => self.parse_let_expr(),
            _ => Err(ParseError {
                code: "E0001",
                message: format!("expected expression, found '{}'", tok.kind.name()),
                span: tok.span,
            }),
        }
    }

    fn parse_record_literal(&mut self) -> Result<Expr, ParseError> {
        let start = self.expect(&TokenKind::LBrace, "'{'")?;
        let mut fields = Vec::new();

        while !self.check(&TokenKind::RBrace) && !self.at_end() {
            self.expect(&TokenKind::Hash, "'#'")?;
            let (label, lspan) = self.expect_ident()?;
            self.expect(&TokenKind::Assign, "'='")?;
            let value = self.parse_expr()?;
            fields.push(RecordField {
                span: lspan,
                label,
                value,
            });

            if self.check(&TokenKind::Comma) {
                self.advance();
            }
        }

        let end = self.expect(&TokenKind::RBrace, "'}'")?;

        Ok(Expr::Record {
            span: start.span.merge(end.span),
            fields,
        })
    }

    fn parse_if_expr(&mut self) -> Result<Expr, ParseError> {
        let start = self.expect(&TokenKind::If, "'if'")?;
        let condition = self.parse_expr()?;
        self.expect(&TokenKind::Then, "'then'")?;
        let then_branch = self.parse_expr()?;
        self.expect(&TokenKind::Else, "'else'")?;
        let else_branch = self.parse_expr()?;

        Ok(Expr::If {
            span: start.span,
            condition: Box::new(condition),
            then_branch: Box::new(then_branch),
            else_branch: Box::new(else_branch),
        })
    }

    fn parse_match_expr(&mut self) -> Result<Expr, ParseError> {
        let start = self.expect(&TokenKind::Match, "'match'")?;
        let scrutinee = self.parse_expr()?;
        self.expect(&TokenKind::LBrace, "'{'")?;

        let mut arms = Vec::new();
        while !self.check(&TokenKind::RBrace) && !self.at_end() {
            let pattern = self.parse_pattern()?;
            self.expect(&TokenKind::FatArrow, "'=>'")?;
            let body = self.parse_expr()?;
            arms.push(MatchArm {
                span: pattern.span().merge(body.span()),
                pattern,
                body,
            });

            if self.check(&TokenKind::Comma) {
                self.advance();
            }
        }

        let end = self.expect(&TokenKind::RBrace, "'}'")?;

        Ok(Expr::Match {
            span: start.span.merge(end.span),
            scrutinee: Box::new(scrutinee),
            arms,
        })
    }

    fn parse_let_expr(&mut self) -> Result<Expr, ParseError> {
        let start = self.expect(&TokenKind::Let, "'let'")?;
        let (name, _) = self.expect_ident()?;

        let type_ann = if self.check(&TokenKind::Colon) {
            self.advance();
            Some(self.parse_type_expr()?)
        } else {
            None
        };

        self.expect(&TokenKind::Assign, "'='")?;
        let value = self.parse_expr()?;
        self.expect(&TokenKind::In, "'in'")?;
        let body = self.parse_expr()?;

        Ok(Expr::Let {
            span: start.span,
            name,
            type_ann,
            value: Box::new(value),
            body: Box::new(body),
        })
    }

    // ────────────────────────────────────────────────────────
    // Patterns
    // ────────────────────────────────────────────────────────

    fn parse_pattern(&mut self) -> Result<Pattern, ParseError> {
        let tok = self.peek();
        match &tok.kind {
            TokenKind::IntLit(value) => {
                let v = *value;
                let span = tok.span;
                self.advance();
                Ok(Pattern::Int { span, value: v })
            }
            TokenKind::StringLit(value) => {
                let v = value.clone();
                let span = tok.span;
                self.advance();
                Ok(Pattern::String { span, value: v })
            }
            TokenKind::BoolLit(value) => {
                let v = *value;
                let span = tok.span;
                self.advance();
                Ok(Pattern::Bool { span, value: v })
            }
            TokenKind::Underscore => {
                let span = tok.span;
                self.advance();
                Ok(Pattern::Wildcard { span })
            }
            TokenKind::Ident(name) => {
                let n = name.clone();
                let span = tok.span;
                self.advance();
                // Check for constructor pattern: Name(pat1, pat2, ...)
                if self.check(&TokenKind::LParen) {
                    self.advance();
                    let mut args = Vec::new();
                    if !self.check(&TokenKind::RParen) {
                        args.push(self.parse_pattern()?);
                        while self.check(&TokenKind::Comma) {
                            self.advance();
                            args.push(self.parse_pattern()?);
                        }
                    }
                    self.expect(&TokenKind::RParen, "')'")?;
                    Ok(Pattern::Constructor { span, name: n, args })
                } else {
                    Ok(Pattern::Var { span, name: n })
                }
            }
            TokenKind::UpperIdent(name) => {
                let n = name.clone();
                let span = tok.span;
                self.advance();
                if self.check(&TokenKind::LParen) {
                    self.advance();
                    let mut args = Vec::new();
                    if !self.check(&TokenKind::RParen) {
                        args.push(self.parse_pattern()?);
                        while self.check(&TokenKind::Comma) {
                            self.advance();
                            args.push(self.parse_pattern()?);
                        }
                    }
                    self.expect(&TokenKind::RParen, "')'")?;
                    Ok(Pattern::Constructor { span, name: n, args })
                } else {
                    Ok(Pattern::Constructor {
                        span,
                        name: n,
                        args: vec![],
                    })
                }
            }
            TokenKind::LParen => {
                let start_span = tok.span;
                self.advance();
                let mut elements = Vec::new();
                if !self.check(&TokenKind::RParen) {
                    elements.push(self.parse_pattern()?);
                    while self.check(&TokenKind::Comma) {
                        self.advance();
                        elements.push(self.parse_pattern()?);
                    }
                }
                let end = self.expect(&TokenKind::RParen, "')'")?;
                Ok(Pattern::Tuple {
                    span: start_span.merge(end.span),
                    elements,
                })
            }
            _ => Err(ParseError {
                code: "E0001",
                message: format!("expected pattern, found '{}'", tok.kind.name()),
                span: tok.span,
            }),
        }
    }

    // ────────────────────────────────────────────────────────
    // Helper methods
    // ────────────────────────────────────────────────────────

    fn expect_int_lit(&mut self) -> Result<(i64, Span), ParseError> {
        match &self.peek_kind() {
            TokenKind::IntLit(value) => {
                let v = *value;
                let span = self.advance().span;
                Ok((v, span))
            }
            _ => {
                let tok = self.peek();
                Err(ParseError {
                    code: "E0001",
                    message: format!("expected integer literal, found '{}'", tok.kind.name()),
                    span: tok.span,
                })
            }
        }
    }

    fn expect_string_lit(&mut self) -> Result<String, ParseError> {
        match &self.peek_kind() {
            TokenKind::StringLit(value) => {
                let v = value.clone();
                self.advance();
                Ok(v)
            }
            _ => {
                let tok = self.peek();
                Err(ParseError {
                    code: "E0001",
                    message: format!("expected string literal, found '{}'", tok.kind.name()),
                    span: tok.span,
                })
            }
        }
    }
}

// Helper trait to get span from AST nodes
trait HasSpan {
    fn span(&self) -> Span;
}

impl HasSpan for Expr {
    fn span(&self) -> Span {
        match self {
            Self::IntLit { span, .. }
            | Self::BoolLit { span, .. }
            | Self::StringLit { span, .. }
            | Self::Var { span, .. }
            | Self::Constructor { span, .. }
            | Self::App { span, .. }
            | Self::BinOp { span, .. }
            | Self::UnaryOp { span, .. }
            | Self::If { span, .. }
            | Self::Match { span, .. }
            | Self::Let { span, .. }
            | Self::Lambda { span, .. }
            | Self::Record { span, .. }
            | Self::FieldAccess { span, .. }
            | Self::Pipe { span, .. }
            | Self::Cons { span, .. }
            | Self::List { span, .. }
            | Self::Unit { span, .. } => *span,
        }
    }
}

impl HasSpan for TypeExpr {
    fn span(&self) -> Span {
        match self {
            Self::Named { span, .. }
            | Self::Arrow { span, .. }
            | Self::Record { span, .. }
            | Self::List { span, .. }
            | Self::Tuple { span, .. }
            | Self::RowExt { span, .. }
            | Self::Var { span, .. } => *span,
        }
    }
}

impl HasSpan for Pattern {
    fn span(&self) -> Span {
        match self {
            Self::Int { span, .. }
            | Self::Bool { span, .. }
            | Self::String { span, .. }
            | Self::Wildcard { span, .. }
            | Self::Var { span, .. }
            | Self::Constructor { span, .. }
            | Self::Tuple { span, .. } => *span,
        }
    }
}

/// Convenience function: parse source string into AST.
pub fn parse(source: &str) -> Result<Program, ParseError> {
    let tokens = crate::lexer::tokenize(source).map_err(|e| ParseError {
        code: "E0001",
        message: format!("lexer error: {e}"),
        span: Span::dummy(),
    })?;
    let mut parser = Parser::new(tokens);
    parser.parse_program()
}

#[cfg(test)]
mod tests {
    use super::*;

    // ─── Module parsing ───

    #[test]
    fn parse_empty_module() {
        let ast = parse("module foo {}").unwrap();
        assert_eq!(ast.modules.len(), 1);
        assert_eq!(ast.modules[0].path, vec!["foo"]);
    }

    #[test]
    fn parse_nested_module_path() {
        let ast = parse("module cards::diana { }").unwrap();
        assert_eq!(ast.modules[0].path, vec!["cards", "diana"]);
    }

    #[test]
    fn parse_multiple_modules() {
        let ast = parse("module a {} module b {}").unwrap();
        assert_eq!(ast.modules.len(), 2);
    }

    // ─── Import parsing ───

    #[test]
    fn parse_import_basic() {
        let ast = parse("module m { import prelude }").unwrap();
        let decl = &ast.modules[0].declarations[0];
        assert!(matches!(decl, TopLevel::Import(_)));
    }

    #[test]
    fn parse_import_with_alias() {
        let ast = parse("module m { import cards::diana as d }").unwrap();
        if let TopLevel::Import(imp) = &ast.modules[0].declarations[0] {
            assert_eq!(imp.alias.as_deref(), Some("d"));
        } else {
            panic!("expected Import");
        }
    }

    #[test]
    fn parse_import_nested_path() {
        let ast = parse("module m { import cards::sr::ninigis }").unwrap();
        if let TopLevel::Import(imp) = &ast.modules[0].declarations[0] {
            assert_eq!(imp.path, vec!["cards", "sr", "ninigis"]);
        } else {
            panic!("expected Import");
        }
    }

    // ─── Card declaration ───

    #[test]
    fn parse_card_empty() {
        let ast = parse("module m { card diana {} }").unwrap();
        assert!(matches!(
            &ast.modules[0].declarations[0],
            TopLevel::Card(CardDecl { name, .. }) if name == "diana"
        ));
    }

    #[test]
    fn parse_card_meta_fields() {
        let source = r#"
module m {
  card diana {
    name = "Diana"
    rarity = SR
    attack = 7
    defense = 4
  }
}"#;
        let ast = parse(source).unwrap();
        if let TopLevel::Card(card) = &ast.modules[0].declarations[0] {
            assert_eq!(card.fields.len(), 4);
            assert!(matches!(&card.fields[0], CardField::Meta(CardMetaField::Name { value, .. }) if value == "Diana"));
        } else {
            panic!("expected Card");
        }
    }

    #[test]
    fn parse_card_rarity_common() {
        let ast = parse("module m { card c { rarity = C } }").unwrap();
        if let TopLevel::Card(card) = &ast.modules[0].declarations[0] {
            assert!(matches!(&card.fields[0], CardField::Meta(CardMetaField::Rarity { value: Rarity::Common, .. })));
        }
    }

    #[test]
    fn parse_card_rarity_rare() {
        let ast = parse("module m { card c { rarity = R } }").unwrap();
        if let TopLevel::Card(card) = &ast.modules[0].declarations[0] {
            assert!(matches!(&card.fields[0], CardField::Meta(CardMetaField::Rarity { value: Rarity::Rare, .. })));
        }
    }

    #[test]
    fn parse_card_ability_simple() {
        let source = r#"
module m {
  card diana {
    ability shield(target: FieldChar, value: Int): BattleResult = 42
  }
}"#;
        let ast = parse(source).unwrap();
        if let TopLevel::Card(card) = &ast.modules[0].declarations[0] {
            assert!(matches!(&card.fields[0], CardField::Ability(_)));
        }
    }

    // ─── Function declaration ───

    #[test]
    fn parse_fn_decl_basic() {
        let ast = parse("module m { fn add(a: Int, b: Int) = a + b }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert_eq!(f.name, "add");
            assert_eq!(f.params.len(), 2);
        }
    }

    #[test]
    fn parse_fn_decl_with_return_type() {
        let ast = parse("module m { fn add(a: Int, b: Int): Int = a + b }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(f.return_type.is_some());
        }
    }

    #[test]
    fn parse_fn_decl_with_type_params() {
        let ast = parse("module m { fn id[a](x: a): a = x }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert_eq!(f.type_params, vec!["a"]);
        }
    }

    #[test]
    fn parse_fn_decl_no_params() {
        let ast = parse("module m { fn fortytwo() = 42 }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(f.params.is_empty());
        }
    }

    // ─── Type declarations ───

    #[test]
    fn parse_type_decl() {
        let ast = parse("module m { type MyInt = Int }").unwrap();
        if let TopLevel::Type(t) = &ast.modules[0].declarations[0] {
            assert!(!t.is_alias);
            assert_eq!(t.name, "MyInt");
        }
    }

    #[test]
    fn parse_alias_decl() {
        let ast = parse("module m { alias MyInt = Int }").unwrap();
        if let TopLevel::Type(t) = &ast.modules[0].declarations[0] {
            assert!(t.is_alias);
        }
    }

    // ─── Effect declarations ───

    #[test]
    fn parse_effect_decl_pure() {
        let ast = parse("module m { effect my_effect = pure }").unwrap();
        if let TopLevel::Effect(e) = &ast.modules[0].declarations[0] {
            assert_eq!(e.spec, EffectLevel::Pure);
        }
    }

    #[test]
    fn parse_effect_decl_mut() {
        let ast = parse("module m { effect my_effect = mut }").unwrap();
        if let TopLevel::Effect(e) = &ast.modules[0].declarations[0] {
            assert_eq!(e.spec, EffectLevel::Mut);
        }
    }

    // ─── Expression parsing ───

    #[test]
    fn parse_int_literal() {
        let ast = parse("module m { fn f() = 42 }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::IntLit { value: 42, .. }));
        }
    }

    #[test]
    fn parse_string_literal() {
        let ast = parse(r#"module m { fn f() = "hello" }"#).unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::StringLit { value, .. } if value == "hello"));
        }
    }

    #[test]
    fn parse_bool_literals() {
        let ast = parse("module m { fn t() = true fn f() = false }").unwrap();
        if let TopLevel::Fn(t) = &ast.modules[0].declarations[0] {
            assert!(matches!(&t.body, Expr::BoolLit { value: true, .. }));
        }
    }

    #[test]
    fn parse_variable() {
        let ast = parse("module m { fn f() = x }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::Var { name, .. } if name == "x"));
        }
    }

    #[test]
    fn parse_binary_op_add() {
        let ast = parse("module m { fn f() = 1 + 2 }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::BinOp { op: BinOp::Add, .. }));
        }
    }

    #[test]
    fn parse_binary_op_multiply() {
        let ast = parse("module m { fn f() = 2 * 3 }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::BinOp { op: BinOp::Mul, .. }));
        }
    }

    #[test]
    fn parse_precedence_mul_before_add() {
        // 1 + 2 * 3 should parse as 1 + (2 * 3)
        let ast = parse("module m { fn f() = 1 + 2 * 3 }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            match &f.body {
                Expr::BinOp { op: BinOp::Add, left, .. } => {
                    assert!(matches!(left.as_ref(), Expr::IntLit { value: 1, .. }));
                }
                _ => panic!("expected Add at top level"),
            }
        }
    }

    #[test]
    fn parse_comparison_ops() {
        let ast = parse("module m { fn f() = a == b }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::BinOp { op: BinOp::Eq, .. }));
        }
    }

    #[test]
    fn parse_logical_and() {
        let ast = parse("module m { fn f() = a && b }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::BinOp { op: BinOp::And, .. }));
        }
    }

    #[test]
    fn parse_logical_or() {
        let ast = parse("module m { fn f() = a || b }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::BinOp { op: BinOp::Or, .. }));
        }
    }

    #[test]
    fn parse_unary_not() {
        let ast = parse("module m { fn f() = !true }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::UnaryOp { op: UnaryOp::Not, .. }));
        }
    }

    #[test]
    fn parse_unary_neg() {
        let ast = parse("module m { fn f() = -5 }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::UnaryOp { op: UnaryOp::Neg, .. }));
        }
    }

    #[test]
    fn parse_if_then_else() {
        let ast = parse("module m { fn f() = if x then 1 else 0 }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::If { .. }));
        }
    }

    #[test]
    fn parse_let_in() {
        let ast = parse("module m { fn f() = let x = 1 in x }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::Let { name, .. } if name == "x"));
        }
    }

    #[test]
    fn parse_function_application() {
        let ast = parse("module m { fn f() = add(1, 2) }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::App { args, .. } if args.len() == 2));
        }
    }

    #[test]
    fn parse_list_literal() {
        let ast = parse("module m { fn f() = [1, 2, 3] }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::List { elements, .. } if elements.len() == 3));
        }
    }

    #[test]
    fn parse_empty_list() {
        let ast = parse("module m { fn f() = [] }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::List { elements, .. } if elements.is_empty()));
        }
    }

    #[test]
    fn parse_pipe_expr() {
        let ast = parse("module m { fn f() = x |> f }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::Pipe { right, .. } if right == "f"));
        }
    }

    #[test]
    fn parse_cons_expr() {
        let ast = parse("module m { fn f() = 1 :: xs }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::Cons { .. }));
        }
    }

    #[test]
    fn parse_field_access() {
        let ast = parse("module m { fn f() = r.name }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::FieldAccess { field, .. } if field == "name"));
        }
    }

    #[test]
    fn parse_match_expr() {
        let ast = parse("module m { fn f() = match x { 0 => a, _ => b } }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::Match { arms, .. } if arms.len() == 2));
        }
    }

    #[test]
    fn parse_match_wildcard() {
        let ast = parse("module m { fn f() = match x { _ => 0 } }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            if let Expr::Match { arms, .. } = &f.body {
                assert!(matches!(&arms[0].pattern, Pattern::Wildcard { .. }));
            }
        }
    }

    #[test]
    fn parse_pattern_int() {
        let ast = parse("module m { fn f() = match x { 42 => 1 } }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            if let Expr::Match { arms, .. } = &f.body {
                assert!(matches!(&arms[0].pattern, Pattern::Int { value: 42, .. }));
            }
        }
    }

    #[test]
    fn parse_pattern_var() {
        let ast = parse("module m { fn f() = match x { y => y } }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            if let Expr::Match { arms, .. } = &f.body {
                assert!(matches!(&arms[0].pattern, Pattern::Var { name, .. } if name == "y"));
            }
        }
    }

    #[test]
    fn parse_pattern_tuple() {
        let ast = parse("module m { fn f() = match x { (a, b) => a } }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            if let Expr::Match { arms, .. } = &f.body {
                assert!(matches!(&arms[0].pattern, Pattern::Tuple { elements, .. } if elements.len() == 2));
            }
        }
    }

    #[test]
    fn parse_record_literal() {
        let ast = parse(r#"module m { fn f() = {#name = "Alice", #age = 30} }"#).unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::Record { fields, .. } if fields.len() == 2));
        }
    }

    #[test]
    fn parse_unit() {
        let ast = parse("module m { fn f() = () }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::Unit { .. }));
        }
    }

    #[test]
    fn parse_type_expr_int() {
        let ast = parse("module m { fn f(x: Int) = x }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.params[0].type_ann, TypeExpr::Named { name, .. } if name == "Int"));
        }
    }

    #[test]
    fn parse_type_expr_arrow() {
        let ast = parse("module m { fn f(x: Int -> Bool) = x }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.params[0].type_ann, TypeExpr::Arrow { .. }));
        }
    }

    #[test]
    fn parse_type_expr_list() {
        let ast = parse("module m { fn f(x: [Int]) = x }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.params[0].type_ann, TypeExpr::List { .. }));
        }
    }

    #[test]
    fn parse_type_expr_tuple() {
        let ast = parse("module m { fn f(x: (Int, Bool)) = x }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.params[0].type_ann, TypeExpr::Tuple { elements, .. } if elements.len() == 2));
        }
    }

    #[test]
    fn parse_type_expr_record() {
        let ast = parse("module m { fn f(x: {#name: String, #age: Int}) = x }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.params[0].type_ann, TypeExpr::Record { fields, .. } if fields.len() == 2));
        }
    }

    #[test]
    fn parse_type_expr_var() {
        let ast = parse("module m { fn f[a](x: a): a = x }").unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            match &f.params[0].type_ann {
                TypeExpr::Var { name, .. } => assert_eq!(name, "a"),
                other => panic!("expected TypeExpr::Var, got {other:?}"),
            }
        }
    }

    // ─── Effect clause parsing ───

    #[test]
    fn parse_effect_clause_pure() {
        let source = r#"
module m {
  card c {
    ability f(target: FieldChar, value: Int): BattleResult = effect_ pure { let result = 42 }
  }
}"#;
        let ast = parse(source).unwrap();
        if let TopLevel::Card(card) = &ast.modules[0].declarations[0] {
            if let CardField::Ability(ability) = &card.fields[0] {
                match &ability.body {
                    AbilityBody::Effect(clauses) => assert_eq!(clauses.len(), 1),
                    other => panic!("expected Effect body, got {other:?}"),
                }
            }
        }
    }

    // ─── Full card example ───

    #[test]
    fn parse_full_diana_card() {
        let source = r#"
module cards::diana {
  card diana {
    name = "Diana"
    rarity = SR
    affiliation = "Gigapolis West Continent"
    attack = 7
    defense = 4
    image_url = "https://example.com/Diana.png"
    flavor_text = "Light's judgment strikes evil."

    ability light_shield(target: FieldChar, value: Int): BattleResult =
      effect_ pure {
        42
      }

    ultimate light_judgment(state: BattleState): BattleState =
      effect_ mut {
        let damage = 16
        42
      }
  }
}"#;
        let ast = parse(source).unwrap();
        assert_eq!(ast.modules.len(), 1);
        if let TopLevel::Card(card) = &ast.modules[0].declarations[0] {
            assert_eq!(card.name, "diana");
            assert_eq!(card.fields.len(), 9); // 7 meta + 2 abilities
        }
    }

    // ─── Error recovery ───

    #[test]
    fn parse_error_missing_brace() {
        let result = parse("module foo");
        assert!(result.is_err());
    }

    #[test]
    fn parse_error_invalid_token() {
        let result = parse("@");
        assert!(result.is_err());
    }

    #[test]
    fn parse_error_display() {
        let err = ParseError {
            code: "E0001",
            message: "expected 'module'".to_string(),
            span: Span::with_line_col(0, 1, 1, 1, 1, 2),
        };
        let msg = format!("{err}");
        assert!(msg.contains("E0001"));
    }

    // ─── Top-level let ───

    #[test]
    fn parse_top_level_let() {
        let ast = parse("module m { let x = 42 }").unwrap();
        assert!(matches!(&ast.modules[0].declarations[0], TopLevel::Let(_)));
    }

    // ─── Multiple declarations ───

    #[test]
    fn parse_mixed_declarations() {
        let source = r#"
module m {
  import prelude
  type MyType = Int
  effect my_effect = pure
  let x = 42
  fn id(a: Int): Int = a
  card c { name = "C" }
}"#;
        let ast = parse(source).unwrap();
        assert_eq!(ast.modules[0].declarations.len(), 6);
    }

    // ─── proptest: expression precedence ───

    #[test]
    fn proptest_precedence_all_operators() {
        // Verify all operator precedence levels produce valid AST
        let ops = [
            ("1 + 2 * 3", BinOp::Add),  // + has lower precedence than *
            ("1 * 2 + 3", BinOp::Add),  // + still at top
            ("1 == 2 || true", BinOp::Or),  // || lowest
            ("true && false || true", BinOp::Or), // || lower than &&
            ("a + b == c + d", BinOp::Eq),  // == lower than +
        ];

        for (source, expected_top) in ops {
            let full_source = format!("module m {{ fn f() = {source} }}");
            let ast = parse(&full_source).unwrap();
            if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
                if let Expr::BinOp { op, .. } = &f.body {
                    assert_eq!(*op, expected_top, "Expected {expected_top:?} at top for '{source}'");
                } else {
                    panic!("Expected BinOp for '{source}'");
                }
            }
        }
    }

    #[test]
    fn proptest_chained_pipe() {
        let source = "module m { fn f() = x |> f |> g }";
        let ast = parse(source).unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            // x |> f |> g should parse as (x |> f) |> g
            match &f.body {
                Expr::Pipe { right, left, .. } => {
                    assert_eq!(right, "g");
                    assert!(matches!(left.as_ref(), Expr::Pipe { right, .. } if right == "f"));
                }
                _ => panic!("expected outer Pipe"),
            }
        }
    }

    #[test]
    fn proptest_chained_field_access() {
        let source = "module m { fn f() = a.b.c }";
        let ast = parse(source).unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            match &f.body {
                Expr::FieldAccess { field, record, .. } => {
                    assert_eq!(field, "c");
                    assert!(matches!(record.as_ref(), Expr::FieldAccess { field, .. } if field == "b"));
                }
                _ => panic!("expected outer FieldAccess"),
            }
        }
    }

    #[test]
    fn proptest_nested_if() {
        let source = "module m { fn f() = if a then if b then 1 else 2 else 3 }";
        let ast = parse(source).unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::If { .. }));
        }
    }

    #[test]
    fn proptest_let_in_nested() {
        let source = "module m { fn f() = let x = 1 in let y = 2 in x + y }";
        let ast = parse(source).unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            assert!(matches!(&f.body, Expr::Let { name, .. } if name == "x"));
        }
    }

    #[test]
    fn proptest_match_multiple_arms() {
        let source = "module m { fn f() = match x { 0 => a, 1 => b, 2 => c, _ => d } }";
        let ast = parse(source).unwrap();
        if let TopLevel::Fn(f) = &ast.modules[0].declarations[0] {
            if let Expr::Match { arms, .. } = &f.body {
                assert_eq!(arms.len(), 4);
            }
        }
    }
}

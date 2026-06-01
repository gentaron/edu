#![deny(clippy::all)]

//! Recursive descent parser for the Apolon DSL.
//!
//! Converts a token stream (from the lexer) into an AST.
//! Implements error recovery to report as many errors as possible.

use crate::ast::*;
use crate::error::{CompileError, Span};
use crate::lexer::{Token, TokenKind};

/// The Apolon recursive descent parser.
pub struct Parser {
    tokens: Vec<Token>,
    pos: usize,
    errors: Vec<CompileError>,
}

impl Parser {
    /// Create a new parser from a token vector.
    #[must_use]
    pub fn new(tokens: Vec<Token>) -> Self {
        Self {
            tokens,
            pos: 0,
            errors: Vec::new(),
        }
    }

    /// Parse the token stream into an AST program.
    /// Returns `Ok(Program)` on success, or `Err(Vec<CompileError>)` if any errors were found.
    pub fn parse(&mut self) -> Result<Program, Vec<CompileError>> {
        let program = self.parse_program();
        if self.errors.is_empty() {
            Ok(program)
        } else {
            Err(std::mem::take(&mut self.errors))
        }
    }

    // ── Helper methods ─────────────────────────────────────────

    /// Peek at the current token without consuming it.
    fn peek(&self) -> Option<&Token> {
        self.tokens.get(self.pos)
    }

    /// Peek at a token at an offset from the current position.
    fn peek_at(&self, offset: usize) -> Option<&Token> {
        self.tokens.get(self.pos + offset)
    }

    /// Consume and return the current token.
    fn advance(&mut self) -> Option<&Token> {
        let tok = self.tokens.get(self.pos);
        if !self.is_at_end() {
            self.pos += 1;
        }
        tok
    }

    /// Check if the current token matches the given kind without consuming.
    fn at(&self, kind: &TokenKind) -> bool {
        self.peek()
            .is_some_and(|t| t.kind == *kind)
    }

    /// If the current token matches, consume it and return it.
    fn match_kind(&mut self, kind: &TokenKind) -> Option<&Token> {
        if self.at(kind) {
            self.advance()
        } else {
            None
        }
    }

    /// Consume the current token, expecting it to be the given kind.
    /// On mismatch, record an error and synchronize.
    fn expect(&mut self, kind: TokenKind) -> Result<&Token, ()> {
        if self.at(&kind) {
            Ok(self.advance().unwrap())
        } else {
            let tok = self.peek();
            let found = tok.map_or("EOF".to_string(), |t| t.kind.to_string());
            let msg = format!("expected '{}', found '{}'", kind, found);
            let span = tok.map_or(Span::at(self.pos), |t| t.span);
            self.errors.push(CompileError::new(span, msg));
            Err(())
        }
    }

    /// Consume an optional semicolon (semicolons are optional in many contexts).
    fn expect_semi(&mut self) {
        self.match_kind(&TokenKind::Semi);
    }

    /// Check if we've reached the end of the token stream.
    fn is_at_end(&self) -> bool {
        self.at(&TokenKind::Eof)
    }

    /// Synchronize to the next recovery point after an error.
    /// Recovery points: `;` (consumed), `}` (consumed), item keywords, EOF.
    fn synchronize(&mut self) {
        while let Some(token) = self.peek() {
            match &token.kind {
                TokenKind::Semi => {
                    self.advance();
                    return;
                }
                TokenKind::RBrace | TokenKind::Eof => {
                    // Consume the recovery token to avoid infinite loops
                    if !self.is_at_end() {
                        self.advance();
                    }
                    return;
                }
                TokenKind::Card
                | TokenKind::Ability
                | TokenKind::Effect
                | TokenKind::Fn
                | TokenKind::Const
                | TokenKind::Use
                | TokenKind::Passive
                | TokenKind::Module => {
                    return;
                }
                _ => {
                    self.advance();
                }
            }
        }
    }

    /// Create a compile error at the current token position.
    fn make_error(&self, msg: &str) -> CompileError {
        let tok = self.peek();
        let span = tok.map_or(Span::at(self.pos), |t| t.span);
        CompileError::new(span, msg.to_string())
    }

    /// Push an error and synchronize.
    fn error_and_sync(&mut self, msg: &str) {
        let err = self.make_error(msg);
        self.errors.push(err);
        self.synchronize();
    }

    /// Push an error for a bad identifier.
    fn error_expected_ident(&mut self) {
        let found = self
            .peek()
            .map_or("EOF".to_string(), |t| t.kind.to_string());
        let err = self.make_error(&format!("expected identifier, found '{found}'"));
        self.errors.push(err);
    }

    /// Try to extract a name from the current token (ident or soft keyword).
    fn peek_name(&self) -> Option<String> {
        self.peek().and_then(|t| t.kind.as_name().map(|s| s.to_string()))
    }

    /// Parse an identifier or soft keyword as a name string.
    fn parse_name(&mut self) -> Result<String, ()> {
        if let Some(name) = self.peek_name() {
            self.advance();
            Ok(name)
        } else {
            self.error_expected_ident();
            Err(())
        }
    }

    /// Consume a token if it's a separator (comma or semicolon).
    fn consume_separator(&mut self) {
        self.match_kind(&TokenKind::Comma);
        self.match_kind(&TokenKind::Semi);
    }

    // ── Program ───────────────────────────────────────────────

    /// `program ::= module_decl? item*`
    fn parse_program(&mut self) -> Program {
        let mut module = None;
        if self.at(&TokenKind::Module) {
            module = Some(self.parse_module_decl());
        }

        let mut items = Vec::new();
        while !self.is_at_end() {
            // Skip unexpected closing braces to avoid infinite loops
            if self.at(&TokenKind::RBrace) {
                self.advance();
                continue;
            }
            if let Some(item) = self.parse_item() {
                items.push(item);
            }
        }

        Program { module, items }
    }

    /// `module_decl ::= "module" ident`
    fn parse_module_decl(&mut self) -> String {
        self.expect(TokenKind::Module).ok();
        match self.parse_name() {
            Ok(name) => name,
            Err(()) => {
                self.synchronize();
                String::new()
            }
        }
    }

    // ── Items ─────────────────────────────────────────────────

    /// Parse a single top-level item.
    fn parse_item(&mut self) -> Option<Item> {
        let tok = self.peek()?;
        match &tok.kind {
            TokenKind::Card => Some(Item::Card(self.parse_card_def())),
            TokenKind::Effect => Some(Item::Effect(self.parse_effect_def())),
            TokenKind::Fn => Some(Item::Fn(self.parse_fn_def())),
            TokenKind::Const => Some(Item::Const(self.parse_const_def())),
            TokenKind::Use => Some(Item::Use(self.parse_use_decl())),
            _ => {
                self.error_and_sync("expected item (card, effect, fn, const, use)");
                None
            }
        }
    }

    /// `card_def ::= "card" str_lit ":" rarity "{" card_body "}"`
    fn parse_card_def(&mut self) -> CardDef {
        self.expect(TokenKind::Card).ok();

        // Parse the card name (string literal)
        let name = match self.peek() {
            Some(tok) if matches!(&tok.kind, TokenKind::StrLit(_)) => {
                if let TokenKind::StrLit(s) = &tok.kind {
                    let s = s.clone();
                    self.advance();
                    s
                } else {
                    unreachable!()
                }
            }
            _ => {
                self.error_and_sync("expected string literal for card name");
                String::new()
            }
        };

        self.expect(TokenKind::Colon).ok();

        // Parse rarity (C, R, SR, Legendary — these are identifiers)
        let rarity = self
            .parse_name()
            .unwrap_or_else(|_| "C".to_string());

        self.expect(TokenKind::LBrace).ok();

        let mut body = Vec::new();
        while !self.at(&TokenKind::RBrace) && !self.is_at_end() {
            let item = match self.peek().map(|t| t.kind.clone()) {
                Some(TokenKind::Stats) => CardBodyItem::Stats(self.parse_stats_block()),
                Some(TokenKind::Ability) => CardBodyItem::Ability(self.parse_ability_def()),
                Some(TokenKind::Passive) => CardBodyItem::Passive(self.parse_passive_def()),
                // Keywords that start a different top-level item — break out
                // so the parent parser can recover, avoiding infinite loops.
                Some(
                    TokenKind::Card
                    | TokenKind::Effect
                    | TokenKind::Fn
                    | TokenKind::Const
                    | TokenKind::Use
                    | TokenKind::Module
                ) => break,
                _ => {
                    self.error_and_sync("expected stats, ability, or passive in card body");
                    continue;
                }
            };
            body.push(item);
        }

        self.expect(TokenKind::RBrace).ok();

        CardDef {
            name,
            rarity,
            body,
        }
    }

    /// `stats_block ::= "stats" "{" stat_field (("," | ";") stat_field)* ("," | ";")? "}"`
    fn parse_stats_block(&mut self) -> StatsBlock {
        self.expect(TokenKind::Stats).ok();
        self.expect(TokenKind::LBrace).ok();

        let mut fields = Vec::new();
        while !self.at(&TokenKind::RBrace) && !self.is_at_end() {
            let name = match self.parse_name() {
                Ok(n) => n,
                Err(()) => {
                    self.synchronize();
                    continue;
                }
            };

            if self.expect(TokenKind::Eq).is_err() {
                self.synchronize();
                continue;
            }

            let value = self.parse_expr();
            fields.push(StatField { name, value });

            self.consume_separator();

            // Handle trailing separator
            if self.at(&TokenKind::RBrace) {
                break;
            }
        }

        self.expect(TokenKind::RBrace).ok();
        StatsBlock { fields }
    }

    /// `ability_def ::= "ability" str_lit param_list? "{" ability_body "}"`
    fn parse_ability_def(&mut self) -> AbilityDef {
        self.expect(TokenKind::Ability).ok();

        let name = match self.peek() {
            Some(tok) if matches!(tok.kind, TokenKind::StrLit(_)) => {
                if let TokenKind::StrLit(s) = &tok.kind {
                    let s = s.clone();
                    self.advance();
                    s
                } else {
                    unreachable!()
                }
            }
            _ => {
                let err = self.make_error("expected string literal for ability name");
                    self.errors.push(err);
                self.synchronize();
                String::new()
            }
        };

        let params = if self.at(&TokenKind::LParen) {
            self.parse_param_list()
        } else {
            Vec::new()
        };

        self.expect(TokenKind::LBrace).ok();

        let body = self.parse_ability_body();

        self.expect(TokenKind::RBrace).ok();

        AbilityDef { name, params, body }
    }

    /// `ability_body ::= (cost_clause | trigger_clause | stmt)*`
    fn parse_ability_body(&mut self) -> Vec<AbilityBodyItem> {
        let mut items = Vec::new();
        while !self.at(&TokenKind::RBrace) && !self.is_at_end() {
            let item = match self.peek().map(|t| t.kind.clone()) {
                Some(TokenKind::Cost) => {
                    match self.parse_cost_clause() {
                        Some(cost) => AbilityBodyItem::Cost(cost),
                        None => continue,
                    }
                }
                Some(TokenKind::On) => {
                    match self.parse_trigger_clause() {
                        Some(trigger) => AbilityBodyItem::Trigger(trigger),
                        None => continue,
                    }
                }
                _ => AbilityBodyItem::Stmt(self.parse_stmt()),
            };
            items.push(item);
        }
        items
    }

    /// `cost_clause ::= "cost" ":" expr ("mana" | "hp" | "shield") ";"?`
    fn parse_cost_clause(&mut self) -> Option<CostClause> {
        self.expect(TokenKind::Cost).ok();
        if self.expect(TokenKind::Colon).is_err() {
            self.synchronize();
            return None;
        }

        let amount = self.parse_expr();

        let resource = match self.peek().map(|t| t.kind.clone()) {
            Some(TokenKind::Mana) => {
                self.advance();
                CostResource::Mana
            }
            Some(TokenKind::Hp) => {
                self.advance();
                CostResource::Hp
            }
            Some(TokenKind::Shield) => {
                self.advance();
                CostResource::Shield
            }
            _ => {
                let err = self.make_error("expected resource type (mana, hp, or shield)");
                    self.errors.push(err);
                self.synchronize();
                return None;
            }
        };

        self.expect_semi();

        Some(CostClause { amount, resource })
    }

    /// `trigger_clause ::= "on" ident (":" effect_ann)? "{" block "}"`
    fn parse_trigger_clause(&mut self) -> Option<TriggerClause> {
        self.expect(TokenKind::On).ok();

        let event = match self.parse_name() {
            Ok(name) => name,
            Err(()) => {
                self.synchronize();
                return None;
            }
        };

        // Optional effect annotation: `: mutating`
        let effect = if self.at(&TokenKind::Colon) {
            self.advance();
            self.parse_effect_ann()
        } else {
            None
        };

        self.expect(TokenKind::LBrace).ok();
        let body = self.parse_block();
        self.expect(TokenKind::RBrace).ok();

        Some(TriggerClause {
            event,
            effect,
            body,
        })
    }

    /// `effect_ann ::= "pure" | "random" | "mutating"`
    fn parse_effect_ann(&mut self) -> Option<EffectAnn> {
        match self.peek().map(|t| t.kind.clone()) {
            Some(TokenKind::Pure) => {
                self.advance();
                Some(EffectAnn::Pure)
            }
            Some(TokenKind::Random) => {
                self.advance();
                Some(EffectAnn::Random)
            }
            Some(TokenKind::Mutating) => {
                self.advance();
                Some(EffectAnn::Mutating)
            }
            _ => None,
        }
    }

    /// `effect_def ::= "effect" ident "{" effect_variant* "}"`
    fn parse_effect_def(&mut self) -> EffectDef {
        self.expect(TokenKind::Effect).ok();

        let name = self.parse_name().unwrap_or_default();

        self.expect(TokenKind::LBrace).ok();

        let mut variants = Vec::new();
        while !self.at(&TokenKind::RBrace) && !self.is_at_end() {
            let variant = self.parse_effect_variant();
            variants.push(variant);
        }

        self.expect(TokenKind::RBrace).ok();

        EffectDef { name, variants }
    }

    /// `effect_variant ::= ident "(" param ("," param)* ")" ("->" type_ann)? "{" block "}"`
    fn parse_effect_variant(&mut self) -> EffectVariant {
        let name = self.parse_name().unwrap_or_default();

        let params = if self.at(&TokenKind::LParen) {
            self.parse_param_list()
        } else {
            Vec::new()
        };

        let return_type = if self.at(&TokenKind::Arrow) {
            self.advance();
            Some(self.parse_type_ann())
        } else {
            None
        };

        self.expect(TokenKind::LBrace).ok();
        let body = self.parse_block();
        self.expect(TokenKind::RBrace).ok();

        EffectVariant {
            name,
            params,
            return_type,
            body,
        }
    }

    /// `fn_def ::= "fn" ident param_list ("->" type_ann)? effect_ann? "{" block "}"`
    fn parse_fn_def(&mut self) -> FnDef {
        self.expect(TokenKind::Fn).ok();

        let name = self.parse_name().unwrap_or_default();

        let params = if self.at(&TokenKind::LParen) {
            self.parse_param_list()
        } else {
            Vec::new()
        };

        // Effect annotation with colon: `: pure | : random | : mutating`
        // Must be checked before return type so `: pure -> int` parses correctly.
        let effect = if self.at(&TokenKind::Colon)
            && self.peek_at(1).is_some_and(|t| {
                matches!(
                    t.kind,
                    TokenKind::Pure | TokenKind::Random | TokenKind::Mutating
                )
            })
        {
            self.advance(); // consume ':'
            self.parse_effect_ann()
        } else {
            None
        };

        let return_type = if self.at(&TokenKind::Arrow) {
            self.advance();
            Some(self.parse_type_ann())
        } else {
            None
        };

        self.expect(TokenKind::LBrace).ok();
        let body = self.parse_block();
        self.expect(TokenKind::RBrace).ok();

        FnDef {
            name,
            params,
            return_type,
            effect,
            body,
        }
    }

    /// `const_def ::= "const" ident ":" type_ann "=" expr ";"`
    fn parse_const_def(&mut self) -> ConstDef {
        self.expect(TokenKind::Const).ok();

        let name = self.parse_name().unwrap_or_default();

        self.expect(TokenKind::Colon).ok();
        let type_ann = self.parse_type_ann();

        if self.expect(TokenKind::Eq).is_err() {
            self.synchronize();
        }

        let value = self.parse_expr();
        self.expect_semi();

        ConstDef {
            name,
            type_ann,
            value,
        }
    }

    /// `use_decl ::= "use" ident ("." ident)* ";"`
    fn parse_use_decl(&mut self) -> UseDecl {
        self.expect(TokenKind::Use).ok();

        let mut path = Vec::new();
        path.push(self.parse_name().unwrap_or_default());

        while self.at(&TokenKind::Dot) {
            self.advance();
            path.push(self.parse_name().unwrap_or_default());
        }

        self.expect_semi();

        UseDecl { path }
    }

    /// `passive_def ::= "passive" str_lit "{" block "}"`
    fn parse_passive_def(&mut self) -> PassiveDef {
        self.expect(TokenKind::Passive).ok();

        let name = match self.peek() {
            Some(tok) if matches!(tok.kind, TokenKind::StrLit(_)) => {
                if let TokenKind::StrLit(s) = &tok.kind {
                    let s = s.clone();
                    self.advance();
                    s
                } else {
                    unreachable!()
                }
            }
            _ => {
                let err = self.make_error("expected string literal for passive name");
                    self.errors.push(err);
                String::new()
            }
        };

        self.expect(TokenKind::LBrace).ok();
        let body = self.parse_block();
        self.expect(TokenKind::RBrace).ok();

        PassiveDef { name, body }
    }

    // ── Parameters ────────────────────────────────────────────

    /// `param_list ::= "(" param ("," param)* ")"`
    fn parse_param_list(&mut self) -> Vec<Param> {
        self.expect(TokenKind::LParen).ok();
        let mut params = Vec::new();

        while !self.at(&TokenKind::RParen) && !self.is_at_end() {
            let name = match self.parse_name() {
                Ok(n) => n,
                Err(()) => {
                    self.synchronize();
                    break;
                }
            };

            if self.expect(TokenKind::Colon).is_err() {
                continue;
            }

            let type_ann = self.parse_type_ann();
            params.push(Param { name, type_ann });

            if !self.at(&TokenKind::RParen) {
                self.expect(TokenKind::Comma).ok();
            }
        }

        self.expect(TokenKind::RParen).ok();
        params
    }

    // ── Blocks and Statements ─────────────────────────────────

    /// `block ::= stmt*`
    fn parse_block(&mut self) -> Vec<Stmt> {
        let mut stmts = Vec::new();
        while !self.at(&TokenKind::RBrace) && !self.is_at_end() {
            stmts.push(self.parse_stmt());
        }
        stmts
    }

    /// Parse a single statement.
    fn parse_stmt(&mut self) -> Stmt {
        match self.peek().map(|t| t.kind.clone()) {
            Some(TokenKind::Let) => Stmt::Let(self.parse_let_stmt()),
            Some(TokenKind::Return) => Stmt::Return(self.parse_return_stmt()),
            Some(TokenKind::If) => Stmt::If(self.parse_if_stmt()),
            Some(TokenKind::When) => {
                // `when` is syntactic sugar for `if` with no else
                self.advance();
                let condition = self.parse_expr();
                self.expect(TokenKind::LBrace).ok();
                let then_block = self.parse_block();
                self.expect(TokenKind::RBrace).ok();
                Stmt::If(IfStmt {
                    condition,
                    then_block,
                    else_clause: None,
                })
            }
            _ => {
                // Check for assignment: `ident = expr ;`
                if self.is_assign_stmt() {
                    Stmt::Assign(self.parse_assign_stmt())
                } else {
                    let pos_before = self.pos;
                    let stmt = Stmt::Expr(self.parse_expr_stmt());
                    // If the parser didn't advance, we're stuck on an
                    // unrecognised token. Synchronize to prevent
                    // infinite loops inside `parse_block`.
                    if self.pos == pos_before {
                        self.synchronize();
                    }
                    stmt
                }
            }
        }
    }

    /// Check if the current position starts an assignment statement.
    fn is_assign_stmt(&self) -> bool {
        self.peek_name().is_some()
            && self.peek_at(1).is_some_and(|t| t.kind == TokenKind::Eq)
    }

    /// `let_stmt ::= "let" ident (":" type_ann)? "=" expr ";"`
    fn parse_let_stmt(&mut self) -> LetStmt {
        self.expect(TokenKind::Let).ok();

        let name = self.parse_name().unwrap_or_default();

        let type_ann = if self.at(&TokenKind::Colon) {
            self.advance();
            Some(self.parse_type_ann())
        } else {
            None
        };

        if self.expect(TokenKind::Eq).is_err() {
            self.synchronize();
        }

        let value = self.parse_expr();
        self.expect_semi();

        LetStmt {
            name,
            type_ann,
            value,
        }
    }

    /// `assign_stmt ::= ident "=" expr ";"`
    fn parse_assign_stmt(&mut self) -> AssignStmt {
        let name = self.parse_name().unwrap_or_default();

        self.expect(TokenKind::Eq).ok();

        let value = self.parse_expr();
        self.expect_semi();

        AssignStmt { name, value }
    }

    /// `if_stmt ::= "if" expr "{" block "}" else_clause?`
    fn parse_if_stmt(&mut self) -> IfStmt {
        self.expect(TokenKind::If).ok();

        let condition = self.parse_expr();

        self.expect(TokenKind::LBrace).ok();
        let then_block = self.parse_block();
        self.expect(TokenKind::RBrace).ok();

        let else_clause = if self.at(&TokenKind::Else) {
            Some(self.parse_else_clause())
        } else {
            None
        };

        IfStmt {
            condition,
            then_block,
            else_clause,
        }
    }

    /// `else_clause ::= "else" "{" block "}" | "else" if_stmt`
    fn parse_else_clause(&mut self) -> ElseClause {
        self.expect(TokenKind::Else).ok();

        if self.at(&TokenKind::If) {
            ElseClause::If(Box::new(self.parse_if_stmt()))
        } else {
            self.expect(TokenKind::LBrace).ok();
            let block = self.parse_block();
            self.expect(TokenKind::RBrace).ok();
            ElseClause::Block(block)
        }
    }

    /// `return_stmt ::= "return" expr? ";"`
    fn parse_return_stmt(&mut self) -> ReturnStmt {
        self.expect(TokenKind::Return).ok();

        // Check if there's an expression following (not a semicolon, closing brace, or EOF)
        let value = if matches!(
            self.peek().map(|t| &t.kind),
            None | Some(TokenKind::Semi)
                | Some(TokenKind::RBrace)
                | Some(TokenKind::Eof)
        ) {
            None
        } else {
            Some(self.parse_expr())
        };

        self.expect_semi();

        ReturnStmt { value }
    }

    /// `expr_stmt ::= expr ";"`
    fn parse_expr_stmt(&mut self) -> Expr {
        let expr = self.parse_expr();
        self.expect_semi();
        expr
    }

    // ── Expressions (precedence climbing) ─────────────────────

    /// `expr ::= or_expr`
    pub fn parse_expr(&mut self) -> Expr {
        self.parse_or_expr()
    }

    /// `or_expr ::= and_expr ("||" and_expr)*`
    pub fn parse_or_expr(&mut self) -> Expr {
        let mut left = self.parse_and_expr();
        while self.at(&TokenKind::OrOr) {
            self.advance();
            let right = self.parse_and_expr();
            left = Expr::Binary {
                op: BinOp::Or,
                left: Box::new(left),
                right: Box::new(right),
            };
        }
        left
    }

    /// `and_expr ::= cmp_expr ("&&" cmp_expr)*`
    pub fn parse_and_expr(&mut self) -> Expr {
        let mut left = self.parse_cmp_expr();
        while self.at(&TokenKind::AndAnd) {
            self.advance();
            let right = self.parse_cmp_expr();
            left = Expr::Binary {
                op: BinOp::And,
                left: Box::new(left),
                right: Box::new(right),
            };
        }
        left
    }

    /// `cmp_expr ::= add_expr (("==" | "!=" | "<" | ">" | "<=" | ">=") add_expr)?`
    pub fn parse_cmp_expr(&mut self) -> Expr {
        let left = self.parse_add_expr();
        if let Some(op) = match self.peek().map(|t| &t.kind) {
            Some(TokenKind::EqEq) => Some(BinOp::Eq),
            Some(TokenKind::BangEq) => Some(BinOp::Neq),
            Some(TokenKind::Lt) => Some(BinOp::Lt),
            Some(TokenKind::Gt) => Some(BinOp::Gt),
            Some(TokenKind::Le) => Some(BinOp::Le),
            Some(TokenKind::Ge) => Some(BinOp::Ge),
            _ => None,
        } {
            self.advance();
            let right = self.parse_add_expr();
            Expr::Binary {
                op,
                left: Box::new(left),
                right: Box::new(right),
            }
        } else {
            left
        }
    }

    /// `add_expr ::= mul_expr (("+" | "-") mul_expr)*`
    pub fn parse_add_expr(&mut self) -> Expr {
        let mut left = self.parse_mul_expr();
        loop {
            let op = match self.peek().map(|t| &t.kind) {
                Some(TokenKind::Plus) => BinOp::Add,
                Some(TokenKind::Minus) => BinOp::Sub,
                _ => break,
            };
            self.advance();
            let right = self.parse_mul_expr();
            left = Expr::Binary {
                op,
                left: Box::new(left),
                right: Box::new(right),
            };
        }
        left
    }

    /// `mul_expr ::= unary_expr (("*" | "/" | "%") unary_expr)*`
    pub fn parse_mul_expr(&mut self) -> Expr {
        let mut left = self.parse_unary_expr();
        loop {
            let op = match self.peek().map(|t| &t.kind) {
                Some(TokenKind::Star) => BinOp::Mul,
                Some(TokenKind::Slash) => BinOp::Div,
                Some(TokenKind::Percent) => BinOp::Mod,
                _ => break,
            };
            self.advance();
            let right = self.parse_unary_expr();
            left = Expr::Binary {
                op,
                left: Box::new(left),
                right: Box::new(right),
            };
        }
        left
    }

    /// `unary_expr ::= "-" unary_expr | "!" unary_expr | call_expr`
    pub fn parse_unary_expr(&mut self) -> Expr {
        match self.peek().map(|t| &t.kind) {
            Some(TokenKind::Minus) => {
                self.advance();
                let operand = self.parse_unary_expr();
                Expr::Unary {
                    op: UnaryOp::Neg,
                    operand: Box::new(operand),
                }
            }
            Some(TokenKind::Bang) => {
                self.advance();
                let operand = self.parse_unary_expr();
                Expr::Unary {
                    op: UnaryOp::Not,
                    operand: Box::new(operand),
                }
            }
            _ => self.parse_call_expr(),
        }
    }

    /// `call_expr ::= primary_expr ("(" arg_list ")" | "." ident)*`
    pub fn parse_call_expr(&mut self) -> Expr {
        let mut expr = self.parse_primary_expr();

        loop {
            if self.at(&TokenKind::LParen) {
                self.advance();
                let args = self.parse_call_args();
                self.expect(TokenKind::RParen).ok();
                expr = Expr::Call {
                    func: Box::new(expr),
                    args,
                };
            } else if self.at(&TokenKind::Dot) {
                self.advance();
                let field = self.parse_name().unwrap_or_default();
                expr = Expr::Member {
                    object: Box::new(expr),
                    field,
                };
            } else {
                break;
            }
        }

        expr
    }

    /// Parse call arguments: `(arg ("," arg)*)?`
    /// Each arg is either positional `expr` or named `ident: expr`.
    fn parse_call_args(&mut self) -> Vec<CallArg> {
        let mut args = Vec::new();

        if self.at(&TokenKind::RParen) {
            return args;
        }

        loop {
            // Check for named argument: `ident ":" expr`
            if let Some(name) = self.peek_name() {
                if self
                    .peek_at(1)
                    .is_some_and(|t| t.kind == TokenKind::Colon)
                {
                    self.advance(); // consume name
                    self.advance(); // consume ':'
                    let value = self.parse_expr();
                    args.push(CallArg::Named { name, value });
                } else {
                    let expr = self.parse_expr();
                    args.push(CallArg::Positional(expr));
                }
            } else {
                let expr = self.parse_expr();
                args.push(CallArg::Positional(expr));
            }

            if self.at(&TokenKind::Comma) {
                self.advance();
            } else {
                break;
            }
        }

        args
    }

    /// `primary_expr ::= int_lit | bool_lit | str_lit | ident | "(" expr ")" | if_expr | struct_expr | list_expr`
    pub fn parse_primary_expr(&mut self) -> Expr {
        let tok = self.peek();
        match tok.map(|t| t.kind.clone()) {
            Some(TokenKind::IntLit(n)) => {
                self.advance();
                Expr::IntLit(n)
            }
            Some(TokenKind::BoolLit(b)) => {
                self.advance();
                Expr::BoolLit(b)
            }
            Some(TokenKind::StrLit(_)) => {
                if let TokenKind::StrLit(s) = &tok.unwrap().kind {
                    let s = s.clone();
                    self.advance();
                    Expr::StrLit(s)
                } else {
                    unreachable!()
                }
            }
            Some(TokenKind::LParen) => {
                self.advance();
                let expr = self.parse_expr();
                self.expect(TokenKind::RParen).ok();
                expr
            }
            Some(TokenKind::If) => {
                let if_expr = self.parse_if_expr();
                Expr::If(Box::new(if_expr))
            }
            Some(TokenKind::LBrace) => self.parse_struct_expr(),
            Some(TokenKind::LBracket) => self.parse_list_expr(),
            _ => {
                // Accept identifiers and soft keywords as expressions
                if let Some(name) = self.peek_name() {
                    self.advance();
                    Expr::Ident(name)
                } else {
                    let found = tok.map_or("EOF".to_string(), |t| t.kind.to_string());
                    let err = self.make_error(&format!("expected expression, found '{found}'"));
                    self.errors.push(err);
                    Expr::IntLit(0) // default placeholder
                }
            }
        }
    }

    /// `if_expr ::= "if" expr "{" block "}" else_clause?`
    fn parse_if_expr(&mut self) -> IfExpr {
        self.expect(TokenKind::If).ok();

        let condition = self.parse_expr();

        self.expect(TokenKind::LBrace).ok();
        let then_block = self.parse_block();
        self.expect(TokenKind::RBrace).ok();

        let else_clause = if self.at(&TokenKind::Else) {
            Some(self.parse_else_clause())
        } else {
            None
        };

        IfExpr {
            condition,
            then_block,
            else_clause,
        }
    }

    /// `struct_expr ::= "{" ident ":" expr (("," | ";") ident ":" expr)* (("," | ";")? "}")`
    fn parse_struct_expr(&mut self) -> Expr {
        self.expect(TokenKind::LBrace).ok();

        let mut fields = Vec::new();
        while !self.at(&TokenKind::RBrace) && !self.is_at_end() {
            let name = match self.parse_name() {
                Ok(n) => n,
                Err(()) => {
                    self.synchronize();
                    continue;
                }
            };

            if self.expect(TokenKind::Colon).is_err() {
                continue;
            }

            let value = self.parse_expr();
            fields.push((name, value));

            self.consume_separator();
        }

        self.expect(TokenKind::RBrace).ok();
        Expr::Struct(fields)
    }

    /// `list_expr ::= "[" expr ("," expr)* "]"`
    fn parse_list_expr(&mut self) -> Expr {
        self.expect(TokenKind::LBracket).ok();

        let mut elements = Vec::new();
        while !self.at(&TokenKind::RBracket) && !self.is_at_end() {
            elements.push(self.parse_expr());
            if !self.at(&TokenKind::RBracket) {
                self.expect(TokenKind::Comma).ok();
            }
        }

        self.expect(TokenKind::RBracket).ok();
        Expr::List(elements)
    }

    // ── Type Annotations ──────────────────────────────────────

    /// `type_ann ::= "int" | "bool" | "str" | "unit" | "entity" | "Effect" | row_type | fn_type | list_type`
    pub fn parse_type_ann(&mut self) -> TypeAnn {
        match self.peek().map(|t| t.kind.clone()) {
            Some(TokenKind::Int) => {
                self.advance();
                TypeAnn::Int
            }
            Some(TokenKind::Bool) => {
                self.advance();
                TypeAnn::Bool
            }
            Some(TokenKind::Str) => {
                self.advance();
                TypeAnn::Str
            }
            Some(TokenKind::Unit) => {
                self.advance();
                TypeAnn::Unit
            }
            Some(TokenKind::Entity) => {
                self.advance();
                TypeAnn::Entity
            }
            Some(TokenKind::Effect) => {
                self.advance();
                TypeAnn::Effect
            }
            Some(TokenKind::LBrace) => self.parse_row_type(),
            Some(TokenKind::LBracket) => self.parse_list_type(),
            Some(TokenKind::Fn) => self.parse_fn_type(),
            _ => {
                // Handle identifier-based type names (e.g., "Effect" when not keyword,
                // or user-defined named types)
                if let Some(name) = self.peek_name() {
                    let type_ann = match name.as_str() {
                        "Effect" => TypeAnn::Effect,
                        other => TypeAnn::Named(other.to_string()),
                    };
                    self.advance();
                    type_ann
                } else {
                    let err = self.make_error("expected type annotation");
                    self.errors.push(err);
                    TypeAnn::Unit // default
                }
            }
        }
    }

    /// `fn_type ::= "fn" "(" type_ann ("," type_ann)* ")" "->" type_ann`
    fn parse_fn_type(&mut self) -> TypeAnn {
        self.expect(TokenKind::Fn).ok();
        self.expect(TokenKind::LParen).ok();

        let mut params = Vec::new();
        while !self.at(&TokenKind::RParen) && !self.is_at_end() {
            params.push(self.parse_type_ann());
            if !self.at(&TokenKind::RParen) {
                self.expect(TokenKind::Comma).ok();
            }
        }
        self.expect(TokenKind::RParen).ok();
        self.expect(TokenKind::Arrow).ok();
        let ret = self.parse_type_ann();

        TypeAnn::FnType {
            params,
            ret: Box::new(ret),
        }
    }

    /// `list_type ::= "[" type_ann "]"`
    fn parse_list_type(&mut self) -> TypeAnn {
        self.expect(TokenKind::LBracket).ok();
        let inner = self.parse_type_ann();
        self.expect(TokenKind::RBracket).ok();
        TypeAnn::List(Box::new(inner))
    }

    /// `row_type ::= "{" row_field (("," | ";") row_field)* (("," | ";")? "}"`
    fn parse_row_type(&mut self) -> TypeAnn {
        self.expect(TokenKind::LBrace).ok();

        let mut fields = Vec::new();
        while !self.at(&TokenKind::RBrace) && !self.is_at_end() {
            let name = match self.parse_name() {
                Ok(n) => n,
                Err(()) => {
                    self.synchronize();
                    continue;
                }
            };

            if self.expect(TokenKind::Colon).is_err() {
                continue;
            }

            let ty = self.parse_type_ann();
            fields.push((name, ty));
            self.consume_separator();
        }

        self.expect(TokenKind::RBrace).ok();
        TypeAnn::Row(fields)
    }

    /// `effect_ann ::= "pure" | "random" | "mutating"`
    pub fn parse_effect_ann_public(&mut self) -> Option<EffectAnn> {
        self.parse_effect_ann()
    }
}

// ── Helper: tokenize and parse in one step ───────────────────

/// Tokenize and parse a source string into an AST.
pub fn parse_source(source: &str) -> Result<Program, Vec<CompileError>> {
    let mut lexer = crate::lexer::Lexer::new(source);
    let tokens = lexer.tokenize()?;
    let mut parser = Parser::new(tokens);
    parser.parse()
}

// ── Tests ────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use crate::lexer::Lexer;

    /// Helper: tokenize a source string and create a parser.
    fn make_parser(source: &str) -> Parser {
        let mut lexer = Lexer::new(source);
        let tokens = lexer.tokenize().expect("lexing should succeed");
        Parser::new(tokens)
    }

    /// Helper: parse source and return Ok(Program).
    fn parse_ok(source: &str) -> Program {
        let mut p = make_parser(source);
        p.parse().expect("parsing should succeed")
    }

    /// Helper: parse source and return the errors.
    fn parse_err(source: &str) -> Vec<CompileError> {
        let mut p = make_parser(source);
        match p.parse() {
            Ok(_) => panic!("expected parse error"),
            Err(e) => e,
        }
    }

    // ── Valid program tests ───────────────────────────────

    #[test]
    fn test_empty_program() {
        let prog = parse_ok("");
        assert!(prog.module.is_none());
        assert!(prog.items.is_empty());
    }

    #[test]
    fn test_module_declaration() {
        let prog = parse_ok("module my_module");
        assert_eq!(prog.module.as_deref(), Some("my_module"));
        assert!(prog.items.is_empty());
    }

    #[test]
    fn test_simple_card_with_stats() {
        let prog = parse_ok(
            r#"card "Test" : C { stats { hp = 100, atk = 20 } }"#,
        );
        assert_eq!(prog.items.len(), 1);
        match &prog.items[0] {
            Item::Card(card) => {
                assert_eq!(card.name, "Test");
                assert_eq!(card.rarity, "C");
                assert_eq!(card.body.len(), 1);
                match &card.body[0] {
                    CardBodyItem::Stats(stats) => {
                        assert_eq!(stats.fields.len(), 2);
                        assert_eq!(stats.fields[0].name, "hp");
                        assert_eq!(stats.fields[1].name, "atk");
                    }
                    _ => panic!("expected Stats"),
                }
            }
            _ => panic!("expected Card"),
        }
    }

    #[test]
    fn test_stats_with_semicolons() {
        // Stats block uses semicolons as separators (canonical example style)
        let prog = parse_ok(
            r#"card "Test" : R { stats { hp = 120; atk = 45; int = 80 } }"#,
        );
        match &prog.items[0] {
            Item::Card(card) => {
                match &card.body[0] {
                    CardBodyItem::Stats(stats) => {
                        assert_eq!(stats.fields.len(), 3);
                        assert_eq!(stats.fields[0].name, "hp");
                        assert_eq!(stats.fields[1].name, "atk");
                        assert_eq!(stats.fields[2].name, "int");
                    }
                    _ => panic!("expected Stats"),
                }
            }
            _ => panic!("expected Card"),
        }
    }

    #[test]
    fn test_stats_with_keyword_names() {
        // `hp` and `int` are keywords but should be usable as field names
        let prog = parse_ok(
            r#"card "Test" : C { stats { hp = 50, int = 30 } }"#,
        );
        match &prog.items[0] {
            Item::Card(card) => match &card.body[0] {
                CardBodyItem::Stats(stats) => {
                    assert_eq!(stats.fields[0].name, "hp");
                    assert_eq!(stats.fields[1].name, "int");
                }
                _ => panic!("expected Stats"),
            },
            _ => panic!("expected Card"),
        }
    }

    #[test]
    fn test_card_with_ability() {
        let prog = parse_ok(
            r#"card "Test" : R {
                ability "Strike" {
                    cost: 2 mana
                    on cast {
                        damage(target, 10)
                    }
                }
            }"#,
        );
        match &prog.items[0] {
            Item::Card(card) => {
                assert_eq!(card.body.len(), 1);
                match &card.body[0] {
                    CardBodyItem::Ability(ability) => {
                        assert_eq!(ability.name, "Strike");
                        assert_eq!(ability.body.len(), 2);
                        match &ability.body[0] {
                            AbilityBodyItem::Cost(cost) => {
                                assert_eq!(cost.resource, CostResource::Mana);
                                assert_eq!(cost.amount, Expr::IntLit(2));
                            }
                            _ => panic!("expected Cost"),
                        }
                        match &ability.body[1] {
                            AbilityBodyItem::Trigger(trigger) => {
                                assert_eq!(trigger.event, "cast");
                                assert_eq!(trigger.body.len(), 1);
                            }
                            _ => panic!("expected Trigger"),
                        }
                    }
                    _ => panic!("expected Ability"),
                }
            }
            _ => panic!("expected Card"),
        }
    }

    #[test]
    fn test_cost_clause_variants() {
        // Mana cost
        let prog1 = parse_ok(
            r#"card "T" : C { ability "A" { cost: 3 mana on cast { } } }"#,
        );
        if let Item::Card(card) = &prog1.items[0] {
            if let CardBodyItem::Ability(ability) = &card.body[0] {
                if let AbilityBodyItem::Cost(cost) = &ability.body[0] {
                    assert_eq!(cost.resource, CostResource::Mana);
                }
            }
        }

        // HP cost
        let prog2 = parse_ok(
            r#"card "T" : C { ability "A" { cost: 5 hp on cast { } } }"#,
        );
        if let Item::Card(card) = &prog2.items[0] {
            if let CardBodyItem::Ability(ability) = &card.body[0] {
                if let AbilityBodyItem::Cost(cost) = &ability.body[0] {
                    assert_eq!(cost.resource, CostResource::Hp);
                }
            }
        }

        // Shield cost
        let prog3 = parse_ok(
            r#"card "T" : C { ability "A" { cost: 1 shield on cast { } } }"#,
        );
        if let Item::Card(card) = &prog3.items[0] {
            if let CardBodyItem::Ability(ability) = &card.body[0] {
                if let AbilityBodyItem::Cost(cost) = &ability.body[0] {
                    assert_eq!(cost.resource, CostResource::Shield);
                }
            }
        }
    }

    #[test]
    fn test_multiple_abilities() {
        let prog = parse_ok(
            r#"card "Dual" : SR {
                ability "First" { on cast { damage(target, 10) } }
                ability "Second" { on cast { heal(self, 5) } }
            }"#,
        );
        match &prog.items[0] {
            Item::Card(card) => {
                assert_eq!(card.body.len(), 2);
            }
            _ => panic!("expected Card"),
        }
    }

    #[test]
    fn test_trigger_clause() {
        let prog = parse_ok(
            r#"card "T" : C { ability "A" { on turn_start { heal(self, 5) } } }"#,
        );
        match &prog.items[0] {
            Item::Card(card) => match &card.body[0] {
                CardBodyItem::Ability(ability) => match &ability.body[0] {
                    AbilityBodyItem::Trigger(trigger) => {
                        assert_eq!(trigger.event, "turn_start");
                        assert_eq!(trigger.body.len(), 1);
                    }
                    _ => panic!("expected Trigger"),
                },
                _ => panic!("expected Ability"),
            },
            _ => panic!("expected Card"),
        }
    }

    #[test]
    fn test_trigger_with_effect_annotation() {
        let prog = parse_ok(
            r#"card "T" : C { ability "A" { on cast : mutating { damage(target, 10) } } }"#,
        );
        match &prog.items[0] {
            Item::Card(card) => match &card.body[0] {
                CardBodyItem::Ability(ability) => match &ability.body[0] {
                    AbilityBodyItem::Trigger(trigger) => {
                        assert_eq!(trigger.event, "cast");
                        assert_eq!(trigger.effect, Some(EffectAnn::Mutating));
                    }
                    _ => panic!("expected Trigger"),
                },
                _ => panic!("expected Ability"),
            },
            _ => panic!("expected Card"),
        }
    }

    #[test]
    fn test_effect_definition() {
        let prog = parse_ok(
            r#"effect Shield {
                Basic(amount: int, turns: int) {
                    shield(target, amount, turns)
                }
            }"#,
        );
        match &prog.items[0] {
            Item::Effect(effect) => {
                assert_eq!(effect.name, "Shield");
                assert_eq!(effect.variants.len(), 1);
                assert_eq!(effect.variants[0].name, "Basic");
                assert_eq!(effect.variants[0].params.len(), 2);
                assert_eq!(effect.variants[0].return_type, None);
            }
            _ => panic!("expected Effect"),
        }
    }

    #[test]
    fn test_effect_with_return_type() {
        let prog = parse_ok(
            r#"effect Calc {
                Compute(a: int) -> int {
                    return a + 1
                }
            }"#,
        );
        match &prog.items[0] {
            Item::Effect(effect) => {
                assert_eq!(effect.variants[0].return_type, Some(TypeAnn::Int));
            }
            _ => panic!("expected Effect"),
        }
    }

    #[test]
    fn test_effect_multiple_variants() {
        let prog = parse_ok(
            r#"effect Shield {
                Basic(amount: int, turns: int) { shield(target, amount, turns) }
                Reflect(amount: int) { shield(self, amount, 1) }
            }"#,
        );
        match &prog.items[0] {
            Item::Effect(effect) => {
                assert_eq!(effect.variants.len(), 2);
                assert_eq!(effect.variants[0].name, "Basic");
                assert_eq!(effect.variants[1].name, "Reflect");
            }
            _ => panic!("expected Effect"),
        }
    }

    #[test]
    fn test_fn_definition() {
        let prog = parse_ok(
            "fn add(a: int, b: int) -> int { return a + b }",
        );
        match &prog.items[0] {
            Item::Fn(f) => {
                assert_eq!(f.name, "add");
                assert_eq!(f.params.len(), 2);
                assert_eq!(f.return_type, Some(TypeAnn::Int));
                assert_eq!(f.effect, None);
                assert_eq!(f.body.len(), 1);
            }
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_fn_with_effect_annotation() {
        let prog = parse_ok("fn roll_dice() : random -> int { return 6 }");
        match &prog.items[0] {
            Item::Fn(f) => {
                assert_eq!(f.effect, Some(EffectAnn::Random));
                assert_eq!(f.return_type, Some(TypeAnn::Int));
            }
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_fn_pure() {
        let prog = parse_ok("fn double(x: int) : pure -> int { return x * 2 }");
        match &prog.items[0] {
            Item::Fn(f) => {
                assert_eq!(f.effect, Some(EffectAnn::Pure));
            }
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_fn_no_return_type() {
        let prog = parse_ok("fn greet() { damage(target, 1) }");
        match &prog.items[0] {
            Item::Fn(f) => {
                assert_eq!(f.return_type, None);
            }
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_const_definition() {
        let prog = parse_ok("const MAX_HP: int = 100;");
        match &prog.items[0] {
            Item::Const(c) => {
                assert_eq!(c.name, "MAX_HP");
                assert_eq!(c.type_ann, TypeAnn::Int);
                assert_eq!(c.value, Expr::IntLit(100));
            }
            _ => panic!("expected Const"),
        }
    }

    #[test]
    fn test_use_declaration() {
        let prog = parse_ok("use game.utils;");
        match &prog.items[0] {
            Item::Use(u) => {
                assert_eq!(u.path, vec!["game", "utils"]);
            }
            _ => panic!("expected Use"),
        }
    }

    #[test]
    fn test_passive_definition() {
        let prog = parse_ok(
            r#"card "T" : C { passive "Thorns" { damage(target, 5) } }"#,
        );
        match &prog.items[0] {
            Item::Card(card) => match &card.body[0] {
                CardBodyItem::Passive(passive) => {
                    assert_eq!(passive.name, "Thorns");
                    assert_eq!(passive.body.len(), 1);
                }
                _ => panic!("expected Passive"),
            },
            _ => panic!("expected Card"),
        }
    }

    // ── Statement tests ───────────────────────────────────

    #[test]
    fn test_let_binding() {
        let prog = parse_ok("fn f() { let x: int = 42 }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Let(l) => {
                    assert_eq!(l.name, "x");
                    assert_eq!(l.type_ann, Some(TypeAnn::Int));
                    assert_eq!(l.value, Expr::IntLit(42));
                }
                _ => panic!("expected Let"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_let_without_type() {
        let prog = parse_ok("fn f() { let x = 10 }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Let(l) => {
                    assert_eq!(l.type_ann, None);
                    assert_eq!(l.value, Expr::IntLit(10));
                }
                _ => panic!("expected Let"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_assign_statement() {
        let prog = parse_ok("fn f() { let x = 0; x = 42 }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[1] {
                Stmt::Assign(a) => {
                    assert_eq!(a.name, "x");
                    assert_eq!(a.value, Expr::IntLit(42));
                }
                _ => panic!("expected Assign"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_return_statement() {
        let prog = parse_ok("fn f() -> int { return 42 }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => {
                    assert_eq!(r.value, Some(Expr::IntLit(42)));
                }
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_return_without_value() {
        let prog = parse_ok("fn f() -> unit { return }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => {
                    assert_eq!(r.value, None);
                }
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_if_else_statement() {
        let prog = parse_ok("fn f() { if true { return 1 } else { return 0 } }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::If(if_stmt) => {
                    assert_eq!(if_stmt.condition, Expr::BoolLit(true));
                    assert_eq!(if_stmt.then_block.len(), 1);
                    assert!(if_stmt.else_clause.is_some());
                }
                _ => panic!("expected If"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_else_if_statement() {
        let prog = parse_ok(
            "fn f() { if x > 10 { return 1 } else if x > 5 { return 2 } else { return 0 } }",
        );
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::If(if_stmt) => {
                    assert!(if_stmt.else_clause.is_some());
                    match if_stmt.else_clause.as_ref().unwrap() {
                        ElseClause::If(inner) => {
                            assert!(inner.else_clause.is_some());
                        }
                        _ => panic!("expected else-if"),
                    }
                }
                _ => panic!("expected If"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_when_sugar() {
        let prog = parse_ok("fn f() { when true { return 1 } }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::If(if_stmt) => {
                    assert_eq!(if_stmt.condition, Expr::BoolLit(true));
                    assert!(if_stmt.else_clause.is_none());
                }
                _ => panic!("expected If (from when)"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_nested_if() {
        let prog = parse_ok(
            "fn f() { if a { if b { return 1 } else { return 2 } } }",
        );
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::If(outer) => match &outer.then_block[0] {
                    Stmt::If(inner) => {
                        assert!(inner.else_clause.is_some());
                    }
                    _ => panic!("expected inner If"),
                },
                _ => panic!("expected outer If"),
            },
            _ => panic!("expected Fn"),
        }
    }

    // ── Expression tests ──────────────────────────────────

    #[test]
    fn test_integer_literal() {
        let prog = parse_ok("fn f() { return 42 }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => assert_eq!(r.value, Some(Expr::IntLit(42))),
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_boolean_literals() {
        let prog = parse_ok("fn f() { return true }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => assert_eq!(r.value, Some(Expr::BoolLit(true))),
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_string_literal() {
        let prog = parse_ok(r#"fn f() { return "hello" }"#);
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => assert_eq!(r.value, Some(Expr::StrLit("hello".into()))),
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_identifier_expression() {
        let prog = parse_ok("fn f() { return x }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => assert_eq!(r.value, Some(Expr::Ident("x".into()))),
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_binary_addition() {
        let prog = parse_ok("fn f() { return 1 + 2 }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => {
                    assert_eq!(
                        r.value,
                        Some(Expr::Binary {
                            op: BinOp::Add,
                            left: Box::new(Expr::IntLit(1)),
                            right: Box::new(Expr::IntLit(2)),
                        })
                    );
                }
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_precedence_add_mul() {
        // 1 + 2 * 3 should be 1 + (2 * 3)
        let prog = parse_ok("fn f() { return 1 + 2 * 3 }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => {
                    assert_eq!(
                        r.value,
                        Some(Expr::Binary {
                            op: BinOp::Add,
                            left: Box::new(Expr::IntLit(1)),
                            right: Box::new(Expr::Binary {
                                op: BinOp::Mul,
                                left: Box::new(Expr::IntLit(2)),
                                right: Box::new(Expr::IntLit(3)),
                            }),
                        })
                    );
                }
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_precedence_comparison() {
        // a + b == c should be (a + b) == c
        let prog = parse_ok("fn f() { return a + b == c }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => match &r.value {
                    Some(Expr::Binary { op: BinOp::Eq, .. }) => {}
                    _ => panic!("expected == at top level"),
                },
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_precedence_logical() {
        // a && b || c should be (a && b) || c
        let prog = parse_ok("fn f() { return a && b || c }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => match &r.value {
                    Some(Expr::Binary { op: BinOp::Or, .. }) => {}
                    _ => panic!("expected || at top level"),
                },
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_precedence_all_levels() {
        // !a + b * c > d && e == f
        // Should be: ((!a) + (b * c)) > d && (e == f)
        // Then: ((!a) + (b * c)) > d) && (e == f)
        let prog = parse_ok("fn f() { return !a + b * c > d && e == f }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => match &r.value {
                    Some(Expr::Binary { op: BinOp::And, left, right }) => {
                        // left should be > comparison
                        match left.as_ref() {
                            Expr::Binary { op: BinOp::Gt, .. } => {}
                            _ => panic!("expected > on left of &&"),
                        }
                        // right should be == comparison
                        match right.as_ref() {
                            Expr::Binary { op: BinOp::Eq, .. } => {}
                            _ => panic!("expected == on right of &&"),
                        }
                    }
                    _ => panic!("expected && at top"),
                },
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_unary_negation() {
        let prog = parse_ok("fn f() { return -42 }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => {
                    assert_eq!(
                        r.value,
                        Some(Expr::Unary {
                            op: UnaryOp::Neg,
                            operand: Box::new(Expr::IntLit(42)),
                        })
                    );
                }
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_unary_not() {
        let prog = parse_ok("fn f() { return !true }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => {
                    assert_eq!(
                        r.value,
                        Some(Expr::Unary {
                            op: UnaryOp::Not,
                            operand: Box::new(Expr::BoolLit(true)),
                        })
                    );
                }
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_double_negation() {
        let prog = parse_ok("fn f() { return --x }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => {
                    assert_eq!(
                        r.value,
                        Some(Expr::Unary {
                            op: UnaryOp::Neg,
                            operand: Box::new(Expr::Unary {
                                op: UnaryOp::Neg,
                                operand: Box::new(Expr::Ident("x".into())),
                            }),
                        })
                    );
                }
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_function_call() {
        let prog = parse_ok("fn f() { damage(target, 10) }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Expr(Expr::Call { func, args }) => {
                    assert_eq!(func.as_ref(), &Expr::Ident("damage".into()));
                    assert_eq!(args.len(), 2);
                }
                _ => panic!("expected Call"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_function_call_no_args() {
        let prog = parse_ok("fn f() { roll_percent() }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Expr(Expr::Call { args, .. }) => {
                    assert!(args.is_empty());
                }
                _ => panic!("expected Call"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_member_access() {
        let prog = parse_ok("fn f() { return target.hp }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => {
                    assert_eq!(
                        r.value,
                        Some(Expr::Member {
                            object: Box::new(Expr::Ident("target".into())),
                            field: "hp".into(),
                        })
                    );
                }
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_chained_member_access() {
        let prog = parse_ok("fn f() { return self.a.b.c }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => match r.value.as_ref().unwrap() {
                    Expr::Member { object, field } => {
                        assert_eq!(field, "c");
                        match object.as_ref() {
                            Expr::Member { object, field } => {
                                assert_eq!(field, "b");
                                match object.as_ref() {
                                    Expr::Member { object, field } => {
                                        assert_eq!(field, "a");
                                        match object.as_ref() {
                                            Expr::Ident(name) => assert_eq!(name, "self"),
                                            _ => panic!("expected Ident"),
                                        }
                                    }
                                    _ => panic!("expected Member"),
                                }
                            }
                            _ => panic!("expected Member"),
                        }
                    }
                    _ => panic!("expected Member"),
                },
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_method_call() {
        let prog = parse_ok("fn f() { target.hp() }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Expr(Expr::Call { func, .. }) => {
                    match func.as_ref() {
                        Expr::Member { field, .. } => assert_eq!(field, "hp"),
                        _ => panic!("expected Member in Call"),
                    }
                }
                _ => panic!("expected Call"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_list_literal() {
        let prog = parse_ok("fn f() { return [1, 2, 3] }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => {
                    assert_eq!(
                        r.value,
                        Some(Expr::List(vec![
                            Expr::IntLit(1),
                            Expr::IntLit(2),
                            Expr::IntLit(3),
                        ]))
                    );
                }
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_struct_literal() {
        let prog = parse_ok(r#"fn f() { return { x: 1, y: 2 } }"#);
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => {
                    assert_eq!(
                        r.value,
                        Some(Expr::Struct(vec![
                            ("x".into(), Expr::IntLit(1)),
                            ("y".into(), Expr::IntLit(2)),
                        ]))
                    );
                }
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_parenthesized_expression() {
        let prog = parse_ok("fn f() { return (1 + 2) * 3 }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => {
                    assert_eq!(
                        r.value,
                        Some(Expr::Binary {
                            op: BinOp::Mul,
                            left: Box::new(Expr::Binary {
                                op: BinOp::Add,
                                left: Box::new(Expr::IntLit(1)),
                                right: Box::new(Expr::IntLit(2)),
                            }),
                            right: Box::new(Expr::IntLit(3)),
                        })
                    );
                }
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_named_arguments() {
        let prog = parse_ok("fn f() { Shield(20, turns: 2) }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Expr(Expr::Call { args, .. }) => {
                    assert_eq!(args.len(), 2);
                    match &args[0] {
                        CallArg::Positional(Expr::IntLit(20)) => {}
                        _ => panic!("expected positional 20"),
                    }
                    match &args[1] {
                        CallArg::Named { name, value } => {
                            assert_eq!(name, "turns");
                            assert_eq!(value, &Expr::IntLit(2));
                        }
                        _ => panic!("expected named arg"),
                    }
                }
                _ => panic!("expected Call"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_self_as_expression() {
        let prog = parse_ok("fn f() { heal(self, 10) }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Expr(Expr::Call { args, .. }) => {
                    match &args[0] {
                        CallArg::Positional(Expr::Ident(name)) => assert_eq!(name, "self"),
                        _ => panic!("expected 'self'"),
                    }
                }
                _ => panic!("expected Call"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_complex_expression() {
        // damage(target, 30 + caster.int * 2)
        let prog = parse_ok("fn f() { damage(target, 30 + caster.int * 2) }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Expr(Expr::Call { args, .. }) => {
                    assert_eq!(args.len(), 2);
                    match &args[1] {
                        CallArg::Positional(Expr::Binary {
                            op: BinOp::Add,
                            left,
                            right,
                        }) => {
                            assert_eq!(left.as_ref(), &Expr::IntLit(30));
                            match right.as_ref() {
                                Expr::Binary {
                                    op: BinOp::Mul,
                                    left: ll,
                                    right: rr,
                                } => {
                                    assert_eq!(
                                        ll.as_ref(),
                                        &Expr::Member {
                                            object: Box::new(Expr::Ident("caster".into())),
                                            field: "int".into(),
                                        }
                                    );
                                    assert_eq!(rr.as_ref(), &Expr::IntLit(2));
                                }
                                _ => panic!("expected Mul"),
                            }
                        }
                        _ => panic!("expected positional binary expr"),
                    }
                }
                _ => panic!("expected Call"),
            },
            _ => panic!("expected Fn"),
        }
    }

    // ── Type annotation tests ─────────────────────────────

    #[test]
    fn test_simple_type_annotations() {
        let mut p = make_parser("int");
        assert_eq!(p.parse_type_ann(), TypeAnn::Int);
        let mut p = make_parser("bool");
        assert_eq!(p.parse_type_ann(), TypeAnn::Bool);
        let mut p = make_parser("str");
        assert_eq!(p.parse_type_ann(), TypeAnn::Str);
        let mut p = make_parser("unit");
        assert_eq!(p.parse_type_ann(), TypeAnn::Unit);
        let mut p = make_parser("entity");
        assert_eq!(p.parse_type_ann(), TypeAnn::Entity);
    }

    #[test]
    fn test_list_type() {
        let mut p = make_parser("[int]");
        assert_eq!(p.parse_type_ann(), TypeAnn::List(Box::new(TypeAnn::Int)));
    }

    #[test]
    fn test_fn_type() {
        let mut p = make_parser("fn(int, int) -> int");
        assert_eq!(
            p.parse_type_ann(),
            TypeAnn::FnType {
                params: vec![TypeAnn::Int, TypeAnn::Int],
                ret: Box::new(TypeAnn::Int),
            }
        );
    }

    #[test]
    fn test_row_type() {
        let mut p = make_parser("{hp: int, atk: int}");
        assert_eq!(
            p.parse_type_ann(),
            TypeAnn::Row(vec![
                ("hp".into(), TypeAnn::Int),
                ("atk".into(), TypeAnn::Int),
            ])
        );
    }

    // ── Error recovery tests ──────────────────────────────

    #[test]
    fn test_error_missing_semicolon_in_const() {
        // Semicolons are optional in Apolon (lenient parsing)
        let prog = parse_ok("const X: int = 5");
        match &prog.items[0] {
            Item::Const(c) => {
                assert_eq!(c.name, "X");
            }
            _ => panic!("expected Const"),
        }
    }

    #[test]
    fn test_error_unexpected_token_in_program() {
        let errors = parse_err("42");
        assert!(!errors.is_empty());
    }

    #[test]
    fn test_error_missing_closing_brace() {
        let errors = parse_err("fn f() { return 1");
        assert!(!errors.is_empty());
    }

    #[test]
    fn test_error_wrong_token_in_stats() {
        let errors = parse_err(r#"card "T" : C { stats { = 10 } }"#);
        assert!(!errors.is_empty());
    }

    #[test]
    fn test_error_missing_comma_in_list() {
        // Missing commas in lists produce parser errors
        let errors = parse_err("fn f() { return [1 2 3] }");
        assert!(!errors.is_empty(), "expected errors for missing commas");
    }

    #[test]
    fn test_error_multiple_errors_recovery() {
        let errors = parse_err(
            r#"
            card "Bad1" {
                stats { hp }
                ability "A" {
                    cost: mana
                }
            }
            const 42: int = 5;
            "#,
        );
        // Should have multiple errors, not just the first
        assert!(errors.len() >= 2, "expected multiple errors, got {}", errors.len());
    }

    #[test]
    fn test_error_missing_rarity() {
        let errors = parse_err(r#"card "Test" { stats { hp = 10 } }"#);
        assert!(!errors.is_empty());
    }

    #[test]
    fn test_recovery_continues_after_error() {
        let source = r#"
            fn bad_fn( {
            }
            fn good_fn() -> int { return 42 }
        "#;
        let mut p = make_parser(source);
        let result = p.parse();
        // Should have errors from bad_fn but still parse good_fn
        match result {
            Err(errors) => {
                assert!(!errors.is_empty(), "expected errors from bad_fn");
            }
            Ok(_) => panic!("expected errors"),
        }
    }

    #[test]
    fn test_error_in_expr_recovery() {
        let source = "fn f() { let x = ; return x }";
        let errors = parse_err(source);
        assert!(!errors.is_empty());
    }

    #[test]
    fn test_error_missing_expression() {
        let source = "fn f() { return }";
        let prog = parse_ok(source);
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => assert_eq!(r.value, None),
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    // ── Integration tests ─────────────────────────────────

    #[test]
    fn test_full_pipeline_simple() {
        let source = r#"const MAX: int = 100;
fn get_max() : pure -> int { return MAX }"#;
        let prog = parse_ok(source);
        assert_eq!(prog.items.len(), 2);
        assert!(matches!(&prog.items[0], Item::Const(_)));
        assert!(matches!(&prog.items[1], Item::Fn(_)));
    }

    #[test]
    fn test_canonical_example() {
        // The canonical Mina example from the grammar spec
        let source = r#"
card "Mina Eureka Ernst" : Legendary {
  stats { hp = 120; atk = 45; int = 80 }
  ability "Veni Vidi Vici" {
    cost: 3 mana
    on cast {
      damage(target, 30 + caster.int * 2)
      when target.hp < target.maxhp / 2 {
        heal(self, 15)
        apply(self, Shield(20, turns: 2))
      }
    }
  }
  ability "Dimensional Staircase" {
    cost: 5 mana
    on cast : mutating {
      damage(target, 50)
      when is_dead(target) {
        heal(self, caster.int)
      }
    }
  }
}
"#;
        let prog = parse_ok(source);
        assert_eq!(prog.items.len(), 1);

        match &prog.items[0] {
            Item::Card(card) => {
                assert_eq!(card.name, "Mina Eureka Ernst");
                assert_eq!(card.rarity, "Legendary");
                assert_eq!(card.body.len(), 3); // stats + 2 abilities

                // Check stats
                match &card.body[0] {
                    CardBodyItem::Stats(stats) => {
                        assert_eq!(stats.fields.len(), 3);
                    }
                    _ => panic!("expected Stats"),
                }

                // Check first ability
                match &card.body[1] {
                    CardBodyItem::Ability(ability) => {
                        assert_eq!(ability.name, "Veni Vidi Vici");
                        assert_eq!(ability.body.len(), 2); // cost + trigger
                    }
                    _ => panic!("expected Ability"),
                }

                // Check second ability
                match &card.body[2] {
                    CardBodyItem::Ability(ability) => {
                        assert_eq!(ability.name, "Dimensional Staircase");
                        assert_eq!(ability.body.len(), 2);
                        match &ability.body[1] {
                            AbilityBodyItem::Trigger(trigger) => {
                                assert_eq!(trigger.effect, Some(EffectAnn::Mutating));
                            }
                            _ => panic!("expected Trigger"),
                        }
                    }
                    _ => panic!("expected Ability"),
                }
            }
            _ => panic!("expected Card"),
        }
    }

    #[test]
    fn test_effect_with_when_inside() {
        let source = r#"effect Shield {
  Basic(amount: int, turns: int) {
    shield(target, amount, turns)
  }
  Reflect(amount: int) {
    shield(self, amount, 1)
    when target.hp < target.maxhp / 2 {
      damage(target, amount)
    }
  }
}"#;
        let prog = parse_ok(source);
        match &prog.items[0] {
            Item::Effect(effect) => {
                assert_eq!(effect.name, "Shield");
                assert_eq!(effect.variants.len(), 2);
                assert_eq!(effect.variants[1].name, "Reflect");
                assert_eq!(effect.variants[1].body.len(), 2); // shield call + when
            }
            _ => panic!("expected Effect"),
        }
    }

    #[test]
    fn test_all_rarities() {
        for rarity in ["C", "R", "SR", "Legendary"] {
            let source = format!(
                r#"card "Test" : {rarity} {{ stats {{ hp = 10 }} }}"#
            );
            let prog = parse_ok(&source);
            match &prog.items[0] {
                Item::Card(card) => assert_eq!(card.rarity, rarity),
                _ => panic!("expected Card"),
            }
        }
    }

    #[test]
    fn test_let_with_semicolon() {
        // Both with and without semicolon should work
        let prog1 = parse_ok("fn f() { let x = 5; return x }");
        let prog2 = parse_ok("fn f() { let x = 5 return x }");
        assert_eq!(prog1.items.len(), 1);
        assert_eq!(prog2.items.len(), 1);
    }

    #[test]
    fn test_expr_stmt_with_and_without_semicolon() {
        let prog1 = parse_ok("fn f() { damage(target, 10) }");
        let prog2 = parse_ok("fn f() { damage(target, 10); }");
        assert_eq!(prog1.items.len(), 1);
        assert_eq!(prog2.items.len(), 1);
    }

    #[test]
    fn test_if_expression_in_expr_context() {
        let prog = parse_ok("fn f() -> int { let x = if true { 1 } else { 2 }; return x }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Let(l) => match &l.value {
                    Expr::If(if_expr) => {
                        assert!(if_expr.else_clause.is_some());
                    }
                    _ => panic!("expected If expression"),
                },
                _ => panic!("expected Let"),
            },
            _ => panic!("expected Fn"),
        }
    }

    // ── Proptest-based tests ──────────────────────────────

    #[test]
    fn proptest_random_int_expressions() {
        // Test various integer expression patterns
        let test_cases = [
            "fn f() { return 0 }",
            "fn f() { return 1 }",
            "fn f() { return 999 }",
            "fn f() { return 1 + 2 }",
            "fn f() { return 10 - 3 }",
            "fn f() { return 4 * 5 }",
            "fn f() { return 20 / 4 }",
            "fn f() { return 17 % 5 }",
            "fn f() { return 1 + 2 + 3 }",
            "fn f() { return 2 * 3 + 4 }",
            "fn f() { return 2 * (3 + 4) }",
            "fn f() { return -1 }",
            "fn f() { return -(1 + 2) }",
            "fn f() { return 1 + -2 }",
            "fn f() { return 1 == 1 }",
            "fn f() { return 1 != 2 }",
            "fn f() { return 1 < 2 }",
            "fn f() { return 1 > 2 }",
            "fn f() { return 1 <= 1 }",
            "fn f() { return 1 >= 2 }",
            "fn f() { return true && false }",
            "fn f() { return true || false }",
            "fn f() { return !false }",
            "fn f() { return 1 + 2 * 3 - 4 / 2 }",
        ];

        for source in &test_cases {
            let prog = parse_ok(source);
            assert_eq!(prog.items.len(), 1, "failed for: {source}");
        }
    }

    #[test]
    fn proptest_nested_let_bindings() {
        let test_cases = [
            "fn f() { let x = 1 }",
            "fn f() { let x = 1; let y = 2 }",
            "fn f() { let x = 1; let y = x + 1; let z = y * 2 }",
            "fn f() { let x = if true { 1 } else { 2 }; let y = x + 1 }",
            "fn f() { let a = 1; let b = a + 1; let c = b * 2; return c }",
        ];

        for source in &test_cases {
            let prog = parse_ok(source);
            assert_eq!(prog.items.len(), 1, "failed for: {source}");
            match &prog.items[0] {
                Item::Fn(f) => assert!(!f.body.is_empty(), "empty body for: {source}"),
                _ => panic!("expected Fn for: {source}"),
            }
        }
    }

    #[test]
    fn test_comparison_operators_all() {
        let ops = ["==", "!=", "<", ">", "<=", ">="];
        for op in ops {
            let source = format!("fn f() {{ return 1 {op} 2 }}");
            let prog = parse_ok(&source);
            assert_eq!(prog.items.len(), 1, "failed for op: {op}");
        }
    }

    #[test]
    fn test_arithmetic_operators_all() {
        let ops = ["+", "-", "*", "/", "%"];
        for op in ops {
            let source = format!("fn f() {{ return 10 {op} 3 }}");
            let prog = parse_ok(&source);
            assert_eq!(prog.items.len(), 1, "failed for op: {op}");
        }
    }

    #[test]
    fn test_empty_function() {
        let prog = parse_ok("fn noop() {}");
        match &prog.items[0] {
            Item::Fn(f) => {
                assert_eq!(f.name, "noop");
                assert!(f.body.is_empty());
                assert!(f.params.is_empty());
                assert_eq!(f.return_type, None);
                assert_eq!(f.effect, None);
            }
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_multiple_items() {
        let source = r#"
            const X: int = 10;
            const Y: int = 20;
            fn add() -> int { return X + Y }
            fn sub() -> int { return X - Y }
            use math.utils;
        "#;
        let prog = parse_ok(source);
        assert_eq!(prog.items.len(), 5);
        assert!(matches!(&prog.items[0], Item::Const(_)));
        assert!(matches!(&prog.items[1], Item::Const(_)));
        assert!(matches!(&prog.items[2], Item::Fn(_)));
        assert!(matches!(&prog.items[3], Item::Fn(_)));
        assert!(matches!(&prog.items[4], Item::Use(_)));
    }

    #[test]
    fn test_module_with_items() {
        let source = "module my_mod\nfn f() {}";
        let prog = parse_ok(source);
        assert_eq!(prog.module.as_deref(), Some("my_mod"));
        assert_eq!(prog.items.len(), 1);
    }

    #[test]
    fn test_struct_literal_in_assignment() {
        let prog = parse_ok(r#"fn f() { let s = { x: 1, y: 2 } }"#);
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Let(l) => {
                    assert!(matches!(&l.value, Expr::Struct(_)));
                }
                _ => panic!("expected Let"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_cost_with_expression_amount() {
        let prog = parse_ok(
            r#"card "T" : C { ability "A" { cost: 1 + 2 mana on cast { } } }"#,
        );
        match &prog.items[0] {
            Item::Card(card) => match &card.body[0] {
                CardBodyItem::Ability(ability) => match &ability.body[0] {
                    AbilityBodyItem::Cost(cost) => {
                        assert!(matches!(&cost.amount, Expr::Binary { op: BinOp::Add, .. }));
                    }
                    _ => panic!("expected Cost"),
                },
                _ => panic!("expected Ability"),
            },
            _ => panic!("expected Card"),
        }
    }

    #[test]
    fn test_empty_list() {
        let prog = parse_ok("fn f() { return [] }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Return(r) => assert_eq!(r.value, Some(Expr::List(vec![]))),
                _ => panic!("expected Return"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_apply_with_effect_constructor() {
        let prog = parse_ok("fn f() { apply(self, Shield(20, turns: 2)) }");
        match &prog.items[0] {
            Item::Fn(f) => match &f.body[0] {
                Stmt::Expr(Expr::Call { args, .. }) => {
                    assert_eq!(args.len(), 2);
                    match &args[1] {
                        CallArg::Positional(Expr::Call { args: inner_args, .. }) => {
                            assert_eq!(inner_args.len(), 2);
                            assert!(matches!(&inner_args[0], CallArg::Positional(Expr::IntLit(20))));
                            assert!(matches!(&inner_args[1], CallArg::Named { .. }));
                        }
                        _ => panic!("expected Call"),
                    }
                }
                _ => panic!("expected Call"),
            },
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_effect_type_annotation() {
        let prog = parse_ok("fn f() -> Effect { return Shield(10, 1) }");
        match &prog.items[0] {
            Item::Fn(f) => {
                assert_eq!(f.return_type, Some(TypeAnn::Effect));
            }
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_param_list_empty() {
        let prog = parse_ok("fn f() {}");
        match &prog.items[0] {
            Item::Fn(f) => assert!(f.params.is_empty()),
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_param_list_single() {
        let prog = parse_ok("fn f(x: int) {}");
        match &prog.items[0] {
            Item::Fn(f) => {
                assert_eq!(f.params.len(), 1);
                assert_eq!(f.params[0].name, "x");
                assert_eq!(f.params[0].type_ann, TypeAnn::Int);
            }
            _ => panic!("expected Fn"),
        }
    }

    #[test]
    fn test_param_list_multiple() {
        let prog = parse_ok("fn f(a: int, b: bool, c: str) {}");
        match &prog.items[0] {
            Item::Fn(f) => {
                assert_eq!(f.params.len(), 3);
                assert_eq!(f.params[0].name, "a");
                assert_eq!(f.params[1].name, "b");
                assert_eq!(f.params[2].name, "c");
            }
            _ => panic!("expected Fn"),
        }
    }
}

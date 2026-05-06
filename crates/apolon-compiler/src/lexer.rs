//! Lexer/Tokenizer for the Apolon DSL.
//!
//! Converts source text into a stream of [`Token`] values with source span
//! information for error reporting. Handles all keywords, operators, delimiters,
//! literals, identifiers, and comments defined in the grammar specification.

use crate::span::Span;

/// All token types produced by the lexer.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum TokenKind {
    // Keywords
    Module,
    Import,
    Card,
    Ability,
    Effect,
    Ultimate,
    Pure,
    View,
    Mut,
    Record,
    Enum,
    Match,
    If,
    Else,
    Then,
    Let,
    Fn,
    Return,
    Type,
    Alias,
    Where,
    EffectMarker,
    In,

    // Built-in type names (keywords)
    Int,
    Bool,
    StringTy,
    Unit,
    FieldChar,
    BattleState,
    BattleResult,
    Enemy,
    PhaseThreshold,
    AbilityType,
    EffectType,

    // Literals
    IntLit(i64),
    StringLit(String),
    BoolLit(bool),

    // Identifiers
    Ident(String),
    UpperIdent(String),

    // Operators
    Plus,
    Minus,
    Star,
    Slash,
    Percent,
    EqEq,
    Neq,
    Lt,
    Gt,
    Le,
    Ge,
    AndAnd,
    OrOr,
    Not,
    Cons,
    Pipe,
    Dot,
    Hash,
    Assign,
    Arrow,
    FatArrow,
    DoubleColon,
    RowExtend,

    // Delimiters
    LParen,
    RParen,
    LBracket,
    RBracket,
    LBrace,
    RBrace,
    Comma,
    Semicolon,
    Colon,
    Underscore,
    EffectBind,

    // Special
    Eof,
}

impl TokenKind {
    /// Returns a human-readable name for the token kind.
    #[must_use]
    pub fn name(&self) -> &'static str {
        match self {
            Self::Module => "module",
            Self::Import => "import",
            Self::Card => "card",
            Self::Ability => "ability",
            Self::Effect => "effect",
            Self::Ultimate => "ultimate",
            Self::Pure => "pure",
            Self::View => "view",
            Self::Mut => "mut",
            Self::Record => "record",
            Self::Enum => "enum",
            Self::Match => "match",
            Self::If => "if",
            Self::Else => "else",
            Self::Then => "then",
            Self::Let => "let",
            Self::Fn => "fn",
            Self::Return => "return",
            Self::Type => "type",
            Self::Alias => "alias",
            Self::Where => "where",
            Self::EffectMarker => "effect_",
            Self::In => "in",
            Self::Int => "Int",
            Self::Bool => "Bool",
            Self::StringTy => "String",
            Self::Unit => "Unit",
            Self::FieldChar => "FieldChar",
            Self::BattleState => "BattleState",
            Self::BattleResult => "BattleResult",
            Self::Enemy => "Enemy",
            Self::PhaseThreshold => "PhaseThreshold",
            Self::AbilityType => "AbilityType",
            Self::EffectType => "EffectType",
            Self::IntLit(_) => "integer literal",
            Self::StringLit(_) => "string literal",
            Self::BoolLit(_) => "boolean literal",
            Self::Ident(_) => "identifier",
            Self::UpperIdent(_) => "upper identifier",
            Self::Plus => "+",
            Self::Minus => "-",
            Self::Star => "*",
            Self::Slash => "/",
            Self::Percent => "%",
            Self::EqEq => "==",
            Self::Neq => "!=",
            Self::Lt => "<",
            Self::Gt => ">",
            Self::Le => "<=",
            Self::Ge => ">=",
            Self::AndAnd => "&&",
            Self::OrOr => "||",
            Self::Not => "!",
            Self::Cons => "::",
            Self::Pipe => "|>",
            Self::Dot => ".",
            Self::Hash => "#",
            Self::Assign => "=",
            Self::Arrow => "->",
            Self::FatArrow => "=>",
            Self::DoubleColon => "::",
            Self::RowExtend => "+",
            Self::LParen => "(",
            Self::RParen => ")",
            Self::LBracket => "[",
            Self::RBracket => "]",
            Self::LBrace => "{",
            Self::RBrace => "}",
            Self::Comma => ",",
            Self::Semicolon => ";",
            Self::Colon => ":",
            Self::Underscore => "_",
            Self::EffectBind => ">>",
            Self::Eof => "end of file",
        }
    }

    /// Returns true if this token kind is a keyword.
    #[must_use]
    pub fn is_keyword(&self) -> bool {
        matches!(
            self,
            Self::Module
                | Self::Import
                | Self::Card
                | Self::Ability
                | Self::Effect
                | Self::Ultimate
                | Self::Pure
                | Self::View
                | Self::Mut
                | Self::Record
                | Self::Enum
                | Self::Match
                | Self::If
                | Self::Else
                | Self::Then
                | Self::Let
                | Self::Fn
                | Self::Return
                | Self::Type
                | Self::Alias
                | Self::Where
                | Self::EffectMarker
                | Self::In
                | Self::Int
                | Self::Bool
                | Self::StringTy
                | Self::Unit
                | Self::FieldChar
                | Self::BattleState
                | Self::BattleResult
                | Self::Enemy
                | Self::PhaseThreshold
                | Self::AbilityType
                | Self::EffectType
        )
    }
}

impl std::fmt::Display for TokenKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.name())
    }
}

/// A lexed token with its source span.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Token {
    pub kind: TokenKind,
    pub span: Span,
}

impl Token {
    #[must_use]
    pub fn new(kind: TokenKind, span: Span) -> Self {
        Self { kind, span }
    }

    /// Returns true if this is an EOF token.
    #[must_use]
    pub fn is_eof(&self) -> bool {
        self.kind == TokenKind::Eof
    }
}

/// Errors produced by the lexer.
#[derive(Debug, Clone, PartialEq)]
pub enum LexError {
    /// Unexpected character encountered.
    UnexpectedChar {
        ch: char,
        span: Span,
    },
    /// Unterminated string literal.
    UnterminatedString {
        span: Span,
    },
    /// Invalid escape sequence in a string.
    InvalidEscape {
        ch: char,
        span: Span,
    },
    /// Integer literal too large.
    IntegerOverflow {
        span: Span,
    },
    /// Unterminated block comment.
    UnterminatedComment {
        span: Span,
    },
}

impl std::fmt::Display for LexError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::UnexpectedChar { ch, span } => {
                write!(f, "unexpected character '{}' at {}", ch, span)
            }
            Self::UnterminatedString { span } => {
                write!(f, "unterminated string literal at {}", span)
            }
            Self::InvalidEscape { ch, span } => {
                write!(f, "invalid escape sequence '\\{}' at {}", ch, span)
            }
            Self::IntegerOverflow { span } => {
                write!(f, "integer literal overflow at {}", span)
            }
            Self::UnterminatedComment { span } => {
                write!(f, "unterminated block comment at {}", span)
            }
        }
    }
}

impl std::error::Error for LexError {}

/// The lexer state machine.
pub struct Lexer<'a> {
    source: &'a str,
    chars: std::iter::Peekable<std::str::Chars<'a>>,
    offset: usize,
    line: u32,
    col: u32,
    _last_span: Option<Span>,
}

impl<'a> Lexer<'a> {
    /// Create a new lexer for the given source text.
    #[must_use]
    pub fn new(source: &'a str) -> Self {
        Self {
            source,
            chars: source.chars().peekable(),
            offset: 0,
            line: 1,
            col: 1,
            _last_span: None,
        }
    }

    /// Returns the current span position.
    fn cur_span(&self) -> Span {
        Span::with_line_col(self.offset, self.offset, self.line, self.col, self.line, self.col)
    }

    /// Advance one character, updating line/col tracking.
    fn advance(&mut self) -> Option<char> {
        let ch = self.chars.next()?;
        if ch == '\n' {
            self.line += 1;
            self.col = 1;
        } else {
            self.col += 1;
        }
        self.offset += ch.len_utf8();
        Some(ch)
    }

    /// Peek at the next character without consuming it.
    fn peek(&mut self) -> Option<&char> {
        self.chars.peek()
    }

    /// Peek two characters ahead.
    fn peek2(&mut self) -> Option<char> {
        let mut clone = self.chars.clone();
        clone.next();
        clone.next()
    }

    /// Skip whitespace.
    fn skip_whitespace(&mut self) {
        while let Some(&ch) = self.peek() {
            if ch.is_whitespace() {
                self.advance();
            } else {
                break;
            }
        }
    }

    /// Skip a line comment.
    fn skip_line_comment(&mut self) {
        while let Some(&ch) = self.peek() {
            if ch == '\n' {
                return;
            }
            self.advance();
        }
    }

    /// Skip a block comment. Returns Err if unterminated.
    fn skip_block_comment(&mut self) -> Result<(), LexError> {
        self.advance(); // consume second '/'
        self.advance(); // consume '*'
        let mut depth = 1u32;

        while let Some(&ch) = self.peek() {
            match ch {
                '/' => {
                    self.advance();
                    if self.peek() == Some(&'*') {
                        self.advance();
                        depth += 1;
                    }
                }
                '*' => {
                    self.advance();
                    if self.peek() == Some(&'/') {
                        self.advance();
                        depth -= 1;
                        if depth == 0 {
                            return Ok(());
                        }
                    }
                }
                _ => {
                    self.advance();
                }
            }
        }

        Err(LexError::UnterminatedComment {
            span: self.cur_span(),
        })
    }

    /// Lex an identifier or keyword.
    fn lex_ident_or_keyword(&mut self) -> TokenKind {
        let start = self.offset;
        let mut text = String::new();

        while let Some(&ch) = self.peek() {
            if ch.is_ascii_alphanumeric() || ch == '_' {
                text.push(ch);
                self.advance();
            } else {
                break;
            }
        }

        let kind = match text.as_str() {
            "module" => TokenKind::Module,
            "import" => TokenKind::Import,
            "card" => TokenKind::Card,
            "ability" => TokenKind::Ability,
            "effect_" => TokenKind::EffectMarker,
            "effect" => TokenKind::Effect,
            "ultimate" => TokenKind::Ultimate,
            "pure" => TokenKind::Pure,
            "view" => TokenKind::View,
            "mut" => TokenKind::Mut,
            "record" => TokenKind::Record,
            "enum" => TokenKind::Enum,
            "match" => TokenKind::Match,
            "if" => TokenKind::If,
            "else" => TokenKind::Else,
            "then" => TokenKind::Then,
            "let" => TokenKind::Let,
            "fn" => TokenKind::Fn,
            "return" => TokenKind::Return,
            "type" => TokenKind::Type,
            "alias" => TokenKind::Alias,
            "where" => TokenKind::Where,
            "in" => TokenKind::In,
            "true" => TokenKind::BoolLit(true),
            "false" => TokenKind::BoolLit(false),
            "Int" => TokenKind::Int,
            "Bool" => TokenKind::Bool,
            "String" => TokenKind::StringTy,
            "Unit" => TokenKind::Unit,
            "FieldChar" => TokenKind::FieldChar,
            "BattleState" => TokenKind::BattleState,
            "BattleResult" => TokenKind::BattleResult,
            "Enemy" => TokenKind::Enemy,
            "PhaseThreshold" => TokenKind::PhaseThreshold,
            "AbilityType" => TokenKind::AbilityType,
            "EffectType" => TokenKind::EffectType,
            _ => {
                // Check if it starts with uppercase (type/constructor name)
                let bytes = self.source.as_bytes();
                if let Some(&first) = bytes.get(start) {
                    if first.is_ascii_uppercase() {
                        TokenKind::UpperIdent(text)
                    } else {
                        TokenKind::Ident(text)
                    }
                } else {
                    TokenKind::Ident(text)
                }
            }
        };

        kind
    }

    /// Lex a number literal.
    fn lex_number(&mut self) -> Result<TokenKind, LexError> {
        let mut text = String::new();
        while let Some(&ch) = self.peek() {
            if ch.is_ascii_digit() {
                text.push(ch);
                self.advance();
            } else {
                break;
            }
        }
        text.parse::<i64>().map(TokenKind::IntLit).or_else(|_| {
            Err(LexError::IntegerOverflow {
                span: self.cur_span(),
            })
        })
    }

    /// Lex a string literal.
    fn lex_string(&mut self) -> Result<TokenKind, LexError> {
        self.advance(); // consume opening "

        let mut value = String::new();
        loop {
            match self.advance() {
                Some('\\') => {
                    // Escape sequence
                    match self.advance() {
                        Some('n') => value.push('\n'),
                        Some('t') => value.push('\t'),
                        Some('\\') => value.push('\\'),
                        Some('"') => value.push('"'),
                        Some(ch) => {
                            return Err(LexError::InvalidEscape {
                                ch,
                                span: self.cur_span(),
                            });
                        }
                        None => {
                            return Err(LexError::UnterminatedString {
                                span: self.cur_span(),
                            });
                        }
                    }
                }
                Some('"') => {
                    return Ok(TokenKind::StringLit(value));
                }
                Some(ch) => {
                    value.push(ch);
                }
                None => {
                    return Err(LexError::UnterminatedString {
                        span: self.cur_span(),
                    });
                }
            }
        }
    }

    /// Lex the next token.
    fn lex_next(&mut self) -> Result<TokenKind, LexError> {
        self.skip_whitespace();

        let start_offset = self.offset;
        let start_line = self.line;
        let start_col = self.col;

        let kind = match self.peek() {
            None => TokenKind::Eof,

            Some(&ch) => {
                match ch {
                    // Comments
                    '/' => {
                        self.advance();
                        match self.peek() {
                            Some('/') => {
                                self.skip_line_comment();
                                return self.lex_next();
                            }
                            Some('*') => {
                                self.skip_block_comment()?;
                                return self.lex_next();
                            }
                            _ => {
                                // It was just a '/' by itself (div)
                                TokenKind::Slash
                            }
                        }
                    }

                    // String literal
                    '"' => self.lex_string()?,

                    // Number literal
                    '0'..='9' => self.lex_number()?,

                    // Identifiers and keywords
                    'a'..='z' | 'A'..='Z' | '_' => {
                        if ch == '_' {
                            self.advance();
                            // Check if it's just a standalone underscore
                            if let Some(&next) = self.peek() {
                                if !next.is_ascii_alphanumeric() && next != '_' {
                                    TokenKind::Underscore
                                } else {
                                    // It's part of an identifier starting with _
                                    // Reconstruct: we already consumed '_'
                                    let mut text = String::from("_");
                                    while let Some(&c) = self.peek() {
                                        if c.is_ascii_alphanumeric() || c == '_' {
                                            text.push(c);
                                            self.advance();
                                        } else {
                                            break;
                                        }
                                    }
                                    TokenKind::Ident(text)
                                }
                            } else {
                                TokenKind::Underscore
                            }
                        } else {
                            self.lex_ident_or_keyword()
                        }
                    }

                    // Multi-character operators
                    '=' => {
                        self.advance();
                        match self.peek() {
                            Some('=') => {
                                self.advance();
                                TokenKind::EqEq
                            }
                            Some('>') => {
                                self.advance();
                                TokenKind::FatArrow
                            }
                            _ => TokenKind::Assign,
                        }
                    }
                    '!' => {
                        self.advance();
                        match self.peek() {
                            Some('=') => {
                                self.advance();
                                TokenKind::Neq
                            }
                            _ => TokenKind::Not,
                        }
                    }
                    '<' => {
                        self.advance();
                        match self.peek() {
                            Some('=') => {
                                self.advance();
                                TokenKind::Le
                            }
                            _ => TokenKind::Lt,
                        }
                    }
                    '>' => {
                        self.advance();
                        match self.peek() {
                            Some('=') => {
                                self.advance();
                                TokenKind::Ge
                            }
                            Some('>') => {
                                self.advance();
                                TokenKind::EffectBind
                            }
                            _ => TokenKind::Gt,
                        }
                    }
                    '&' => {
                        self.advance();
                        match self.peek() {
                            Some('&') => {
                                self.advance();
                                TokenKind::AndAnd
                            }
                            _ => {
                                return Err(LexError::UnexpectedChar {
                                    ch: '&',
                                    span: self.cur_span(),
                                });
                            }
                        }
                    }
                    '|' => {
                        self.advance();
                        match self.peek() {
                            Some('|') => {
                                self.advance();
                                TokenKind::OrOr
                            }
                            Some('>') => {
                                self.advance();
                                TokenKind::Pipe
                            }
                            _ => {
                                return Err(LexError::UnexpectedChar {
                                    ch: '|',
                                    span: self.cur_span(),
                                });
                            }
                        }
                    }
                    ':' => {
                        self.advance();
                        match self.peek() {
                            Some(':') => {
                                self.advance();
                                TokenKind::Cons
                            }
                            _ => TokenKind::Colon,
                        }
                    }
                    '-' => {
                        self.advance();
                        match self.peek() {
                            Some('>') => {
                                self.advance();
                                TokenKind::Arrow
                            }
                            _ => TokenKind::Minus,
                        }
                    }
                    '+' => {
                        self.advance();
                        TokenKind::RowExtend
                    }

                    // Single-character operators/delimiters
                    '(' => {
                        self.advance();
                        TokenKind::LParen
                    }
                    ')' => {
                        self.advance();
                        TokenKind::RParen
                    }
                    '[' => {
                        self.advance();
                        TokenKind::LBracket
                    }
                    ']' => {
                        self.advance();
                        TokenKind::RBracket
                    }
                    '{' => {
                        self.advance();
                        TokenKind::LBrace
                    }
                    '}' => {
                        self.advance();
                        TokenKind::RBrace
                    }
                    ',' => {
                        self.advance();
                        TokenKind::Comma
                    }
                    ';' => {
                        self.advance();
                        TokenKind::Semicolon
                    }
                    '*' => {
                        self.advance();
                        TokenKind::Star
                    }
                    '%' => {
                        self.advance();
                        TokenKind::Percent
                    }
                    '.' => {
                        self.advance();
                        TokenKind::Dot
                    }
                    '#' => {
                        self.advance();
                        TokenKind::Hash
                    }

                    _ => {
                        let span = self.cur_span();
                        self.advance();
                        return Err(LexError::UnexpectedChar { ch, span });
                    }
                }
            }
        };

        let span = Span::with_line_col(
            start_offset,
            self.offset,
            start_line,
            start_col,
            self.line,
            self.col,
        );

        self._last_span = Some(span);
        Ok(kind)
    }

}

impl<'a> Lexer<'a> {
    /// Tokenize the entire source into a vector of tokens.
    ///
    /// Returns `Ok(tokens)` on success or `Err(LexError)` on the first error.
    pub fn tokenize(&mut self) -> Result<Vec<Token>, LexError> {
        let mut tokens = Vec::new();

        loop {
            let kind = self.lex_next()?;
            let span = self._last_span.unwrap_or(Span::dummy());

            if kind == TokenKind::Eof {
                tokens.push(Token::new(kind, span));
                break;
            }
            tokens.push(Token::new(kind, span));
        }

        Ok(tokens)
    }
}

/// Convenience function: tokenize source string into tokens.
pub fn tokenize(source: &str) -> Result<Vec<Token>, LexError> {
    let mut lexer = Lexer::new(source);
    lexer.tokenize()
}

#[cfg(test)]
mod tests {
    use super::*;

    // ─── Keyword tests ───

    #[test]
    fn lex_module_keyword() {
        let tokens = tokenize("module").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Module);
    }

    #[test]
    fn lex_import_keyword() {
        let tokens = tokenize("import").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Import);
    }

    #[test]
    fn lex_card_keyword() {
        let tokens = tokenize("card").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Card);
    }

    #[test]
    fn lex_ability_keyword() {
        let tokens = tokenize("ability").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Ability);
    }

    #[test]
    fn lex_effect_keyword() {
        let tokens = tokenize("effect").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Effect);
    }

    #[test]
    fn lex_effect_marker() {
        let tokens = tokenize("effect_").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::EffectMarker);
    }

    #[test]
    fn lex_pure_keyword() {
        let tokens = tokenize("pure").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Pure);
    }

    #[test]
    fn lex_view_keyword() {
        let tokens = tokenize("view").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::View);
    }

    #[test]
    fn lex_mut_keyword() {
        let tokens = tokenize("mut").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Mut);
    }

    #[test]
    fn lex_match_keyword() {
        let tokens = tokenize("match").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Match);
    }

    #[test]
    fn lex_if_keyword() {
        let tokens = tokenize("if").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::If);
    }

    #[test]
    fn lex_else_keyword() {
        let tokens = tokenize("else").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Else);
    }

    #[test]
    fn lex_then_keyword() {
        let tokens = tokenize("then").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Then);
    }

    #[test]
    fn lex_let_keyword() {
        let tokens = tokenize("let").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Let);
    }

    #[test]
    fn lex_fn_keyword() {
        let tokens = tokenize("fn").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Fn);
    }

    #[test]
    fn lex_return_keyword() {
        let tokens = tokenize("return").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Return);
    }

    #[test]
    fn lex_type_keyword() {
        let tokens = tokenize("type").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Type);
    }

    #[test]
    fn lex_alias_keyword() {
        let tokens = tokenize("alias").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Alias);
    }

    #[test]
    fn lex_where_keyword() {
        let tokens = tokenize("where").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Where);
    }

    #[test]
    fn lex_in_keyword() {
        let tokens = tokenize("in").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::In);
    }

    // ─── Built-in type name tests ───

    #[test]
    fn lex_int_type() {
        let tokens = tokenize("Int").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Int);
    }

    #[test]
    fn lex_bool_type() {
        let tokens = tokenize("Bool").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Bool);
    }

    #[test]
    fn lex_string_type() {
        let tokens = tokenize("String").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::StringTy);
    }

    #[test]
    fn lex_unit_type() {
        let tokens = tokenize("Unit").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Unit);
    }

    #[test]
    fn lex_battle_state_type() {
        let tokens = tokenize("BattleState").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::BattleState);
    }

    // ─── Operator tests ───

    #[test]
    fn lex_arithmetic_operators() {
        let tokens = tokenize("+ - * / %").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::RowExtend);
        assert_eq!(tokens[1].kind, TokenKind::Minus);
        assert_eq!(tokens[2].kind, TokenKind::Star);
        assert_eq!(tokens[3].kind, TokenKind::Slash);
        assert_eq!(tokens[4].kind, TokenKind::Percent);
    }

    #[test]
    fn lex_comparison_operators() {
        let tokens = tokenize("== != < > <= >=").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::EqEq);
        assert_eq!(tokens[1].kind, TokenKind::Neq);
        assert_eq!(tokens[2].kind, TokenKind::Lt);
        assert_eq!(tokens[3].kind, TokenKind::Gt);
        assert_eq!(tokens[4].kind, TokenKind::Le);
        assert_eq!(tokens[5].kind, TokenKind::Ge);
    }

    #[test]
    fn lex_logical_operators() {
        let tokens = tokenize("&& || !").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::AndAnd);
        assert_eq!(tokens[1].kind, TokenKind::OrOr);
        assert_eq!(tokens[2].kind, TokenKind::Not);
    }

    #[test]
    fn lex_cons_operator() {
        let tokens = tokenize("::").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Cons);
    }

    #[test]
    fn lex_pipe_operator() {
        let tokens = tokenize("|>").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Pipe);
    }

    #[test]
    fn lex_arrow() {
        let tokens = tokenize("->").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Arrow);
    }

    #[test]
    fn lex_fat_arrow() {
        let tokens = tokenize("=>").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::FatArrow);
    }

    #[test]
    fn lex_assign() {
        let tokens = tokenize("=").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Assign);
    }

    #[test]
    fn lex_hash() {
        let tokens = tokenize("#").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Hash);
    }

    #[test]
    fn lex_dot() {
        let tokens = tokenize(".").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Dot);
    }

    // ─── Delimiter tests ───

    #[test]
    fn lex_parentheses() {
        let tokens = tokenize("()").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::LParen);
        assert_eq!(tokens[1].kind, TokenKind::RParen);
    }

    #[test]
    fn lex_brackets() {
        let tokens = tokenize("[]").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::LBracket);
        assert_eq!(tokens[1].kind, TokenKind::RBracket);
    }

    #[test]
    fn lex_braces() {
        let tokens = tokenize("{}").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::LBrace);
        assert_eq!(tokens[1].kind, TokenKind::RBrace);
    }

    #[test]
    fn lex_comma_semicolon() {
        let tokens = tokenize(", ;").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Comma);
        assert_eq!(tokens[1].kind, TokenKind::Semicolon);
    }

    #[test]
    fn lex_colon() {
        let tokens = tokenize(":").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Colon);
    }

    #[test]
    fn lex_underscore() {
        let tokens = tokenize("_").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Underscore);
    }

    // ─── Literal tests ───

    #[test]
    fn lex_integer_literal() {
        let tokens = tokenize("42").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::IntLit(42));
    }

    #[test]
    fn lex_zero() {
        let tokens = tokenize("0").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::IntLit(0));
    }

    #[test]
    fn lex_large_integer() {
        let tokens = tokenize("999999").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::IntLit(999999));
    }

    #[test]
    fn lex_string_literal() {
        let tokens = tokenize(r#""hello""#).unwrap();
        assert_eq!(tokens[0].kind, TokenKind::StringLit("hello".to_string()));
    }

    #[test]
    fn lex_string_empty() {
        let tokens = tokenize(r#""""#).unwrap();
        assert_eq!(tokens[0].kind, TokenKind::StringLit(String::new()));
    }

    #[test]
    fn lex_string_escapes() {
        let tokens = tokenize(r#""\n\t\\\"""#).unwrap();
        assert_eq!(tokens[0].kind, TokenKind::StringLit("\n\t\\\"".to_string()));
    }

    #[test]
    fn lex_bool_true() {
        let tokens = tokenize("true").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::BoolLit(true));
    }

    #[test]
    fn lex_bool_false() {
        let tokens = tokenize("false").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::BoolLit(false));
    }

    // ─── Identifier tests ───

    #[test]
    fn lex_lowercase_ident() {
        let tokens = tokenize("foo").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Ident("foo".to_string()));
    }

    #[test]
    fn lex_uppercase_ident() {
        let tokens = tokenize("Foo").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::UpperIdent("Foo".to_string()));
    }

    #[test]
    fn lex_ident_with_numbers() {
        let tokens = tokenize("x123").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Ident("x123".to_string()));
    }

    #[test]
    fn lex_ident_with_underscore_prefix() {
        let tokens = tokenize("_foo").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Ident("_foo".to_string()));
    }

    #[test]
    fn lex_ident_with_underscore_mid() {
        let tokens = tokenize("my_var").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Ident("my_var".to_string()));
    }

    // ─── Comment tests ───

    #[test]
    fn lex_line_comment() {
        let tokens = tokenize("// this is a comment\n42").unwrap();
        // First non-comment token should be 42
        assert_eq!(tokens[0].kind, TokenKind::IntLit(42));
    }

    #[test]
    fn lex_block_comment() {
        let tokens = tokenize("/* comment */ 42").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::IntLit(42));
    }

    #[test]
    fn lex_nested_block_comment() {
        let tokens = tokenize("/* outer /* inner */ end */ 42").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::IntLit(42));
    }

    // ─── Error tests ───

    #[test]
    fn lex_unterminated_string() {
        let result = tokenize(r#""unterminated"#);
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), LexError::UnterminatedString { .. }));
    }

    #[test]
    fn lex_invalid_escape() {
        let result = tokenize(r#""\x""#);
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), LexError::InvalidEscape { .. }));
    }

    #[test]
    fn lex_unexpected_char() {
        let result = tokenize("@");
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), LexError::UnexpectedChar { .. }));
    }

    #[test]
    fn lex_unterminated_comment() {
        let result = tokenize("/* unterminated");
        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), LexError::UnterminatedComment { .. }));
    }

    // ─── Complex token sequences ───

    #[test]
    fn lex_module_declaration_start() {
        let tokens = tokenize("module cards::diana {").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Module);
        assert_eq!(tokens[1].kind, TokenKind::Ident("cards".to_string()));
        assert_eq!(tokens[2].kind, TokenKind::Cons); // '::' parsed as Cons
        assert_eq!(tokens[3].kind, TokenKind::Ident("diana".to_string()));
        assert_eq!(tokens[4].kind, TokenKind::LBrace);
    }

    #[test]
    fn lex_function_signature() {
        let tokens = tokenize("fn add(a: Int, b: Int): Int").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Fn);
        assert_eq!(tokens[1].kind, TokenKind::Ident("add".to_string()));
        assert_eq!(tokens[2].kind, TokenKind::LParen);
        assert_eq!(tokens[3].kind, TokenKind::Ident("a".to_string()));
        assert_eq!(tokens[4].kind, TokenKind::Colon);
        assert_eq!(tokens[5].kind, TokenKind::Int);
    }

    #[test]
    fn lex_let_in() {
        let tokens = tokenize("let x = 5 in x + 1").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Let);
        assert_eq!(tokens[1].kind, TokenKind::Ident("x".to_string()));
        assert_eq!(tokens[2].kind, TokenKind::Assign);
        assert_eq!(tokens[3].kind, TokenKind::IntLit(5));
        assert_eq!(tokens[4].kind, TokenKind::In);
    }

    #[test]
    fn lex_match_expr() {
        let tokens = tokenize("match x { 0 => a, _ => b }").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Match);
        assert_eq!(tokens[1].kind, TokenKind::Ident("x".to_string()));
        assert_eq!(tokens[2].kind, TokenKind::LBrace);
        assert_eq!(tokens[3].kind, TokenKind::IntLit(0));
        assert_eq!(tokens[4].kind, TokenKind::FatArrow);
    }

    #[test]
    fn lex_record_literal() {
        let tokens = tokenize("{#name: \"Alice\", #age: 30}").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::LBrace);
        assert_eq!(tokens[1].kind, TokenKind::Hash);
    }

    #[test]
    fn lex_full_card_example() {
        let source = r#"
module cards::diana {
  card diana {
    name = "Diana"
    rarity = SR
    attack = 7
    defense = 4
  }
}"#;
        let tokens = tokenize(source).unwrap();
        assert!(!tokens.is_empty());
        // Last token should be EOF
        assert_eq!(tokens.last().unwrap().kind, TokenKind::Eof);
    }

    #[test]
    fn lex_effect_bind() {
        let tokens = tokenize(">>").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::EffectBind);
    }

    #[test]
    fn lex_record_type() {
        let tokens = tokenize("{#name: String, #age: Int}").unwrap();
        assert_eq!(tokens[0].kind, TokenKind::LBrace);
        assert_eq!(tokens[1].kind, TokenKind::Hash);
    }

    #[test]
    fn lex_empty_source() {
        let tokens = tokenize("").unwrap();
        assert_eq!(tokens.len(), 1);
        assert_eq!(tokens[0].kind, TokenKind::Eof);
    }

    #[test]
    fn lex_whitespace_only() {
        let tokens = tokenize("   \n\t  ").unwrap();
        assert_eq!(tokens.len(), 1);
        assert_eq!(tokens[0].kind, TokenKind::Eof);
    }

    #[test]
    fn keyword_is_keyword_flag() {
        assert!(TokenKind::Module.is_keyword());
        assert!(TokenKind::Int.is_keyword());
        assert!(TokenKind::Pure.is_keyword());
        assert!(!TokenKind::Ident("foo".to_string()).is_keyword());
        assert!(!TokenKind::Plus.is_keyword());
        assert!(!TokenKind::Eof.is_keyword());
    }

    #[test]
    fn token_kind_display() {
        assert_eq!(format!("{}", TokenKind::Module), "module");
        assert_eq!(format!("{}", TokenKind::Plus), "+");
        assert_eq!(format!("{}", TokenKind::Eof), "end of file");
    }

    #[test]
    fn lex_error_display() {
        let err = LexError::UnexpectedChar {
            ch: '@',
            span: Span::with_line_col(0, 1, 1, 1, 1, 2),
        };
        let msg = format!("{err}");
        assert!(msg.contains("unexpected character"));
        assert!(msg.contains("@"));
    }

    // ─── proptest: identifiers roundtrip ───

    #[test]
    fn proptest_ident_lexes_correctly() {
        // Simple property test: single-letter lowercase idents lex as Ident
        for ch in b'a'..=b'z' {
            let s = String::from_utf8(vec![ch]).unwrap();
            let tokens = tokenize(&s).unwrap();
            assert_eq!(
                tokens[0].kind,
                TokenKind::Ident(s.clone()),
                "Expected Ident({s}) for char {ch}"
            );
        }
    }

    #[test]
    fn proptest_upper_ident_lexes_correctly() {
        for ch in b'A'..=b'Z' {
            let s = String::from_utf8(vec![ch]).unwrap();
            let tokens = tokenize(&s).unwrap();
            match &tokens[0].kind {
                TokenKind::UpperIdent(name) => {
                    assert_eq!(name, &s, "Expected UpperIdent({s})");
                }
                // C, R, S, etc. could be keywords or type names — skip those
                TokenKind::Int | TokenKind::Bool | TokenKind::StringTy | TokenKind::Unit => {
                    // These are reserved type names, valid
                }
                other => {
                    panic!("Unexpected token for char {ch}: {other:?}");
                }
            }
        }
    }

    #[test]
    fn proptest_single_digit_lexes() {
        for ch in b'0'..=b'9' {
            let s = String::from_utf8(vec![ch]).unwrap();
            let tokens = tokenize(&s).unwrap();
            assert_eq!(tokens[0].kind, TokenKind::IntLit((ch - b'0') as i64));
        }
    }

    #[test]
    fn proptest_keyword_distinct() {
        let keywords = [
            "module", "import", "card", "ability", "effect", "pure", "view", "mut",
            "match", "if", "else", "then", "let", "fn", "return", "type", "alias",
            "where", "in",
        ];
        let mut seen = std::collections::HashSet::new();
        for kw in &keywords {
            let tokens = tokenize(kw).unwrap();
            let kind_name = format!("{:?}", tokens[0].kind);
            assert!(
                seen.insert(kind_name),
                "Duplicate keyword token kind for '{kw}'"
            );
        }
    }
}

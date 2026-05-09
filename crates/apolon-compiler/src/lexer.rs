//! Lexer for the Apolon DSL — tokenizes source strings into `Token` vectors.

use crate::error::Span;

/// The kind of a lexical token.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum TokenKind {
    // ── Keywords ──────────────────────────────────────────────
    /// `card`
    Card,
    /// `ability`
    Ability,
    /// `stats`
    Stats,
    /// `on`
    On,
    /// `cast`
    Cast,
    /// `when`
    When,
    /// `if`
    If,
    /// `else`
    Else,
    /// `let`
    Let,
    /// `fn`
    Fn,
    /// `pure`
    Pure,
    /// `random`
    Random,
    /// `mutating`
    Mutating,
    /// `effect`
    Effect,
    /// `int`
    Int,
    /// `bool`
    Bool,
    /// `str`
    Str,
    /// `unit`
    Unit,
    /// `entity`
    Entity,
    /// `damage`
    Damage,
    /// `heal`
    Heal,
    /// `shield`
    Shield,
    /// `apply`
    Apply,
    /// `self`
    SelfKw,
    /// `target`
    Target,
    /// `caster`
    Caster,
    /// `return`
    Return,
    /// `cost`
    Cost,
    /// `mana`
    Mana,
    /// `hp`
    Hp,
    /// `turn_start`
    TurnStart,
    /// `turn_end`
    TurnEnd,
    /// `module`
    Module,
    /// `passive`
    Passive,
    /// `use`
    Use,
    /// `const`
    Const,

    // ── Literals ──────────────────────────────────────────────
    /// Integer literal (stores parsed value).
    IntLit(i64),
    /// Boolean literal.
    BoolLit(bool),
    /// String literal (content without quotes).
    StrLit(String),
    /// Identifier.
    Ident(String),

    // ── Operators ─────────────────────────────────────────────
    /// `+`
    Plus,
    /// `-`
    Minus,
    /// `*`
    Star,
    /// `/`
    Slash,
    /// `%`
    Percent,
    /// `=` (assignment)
    Eq,
    /// `==`
    EqEq,
    /// `!=`
    BangEq,
    /// `<`
    Lt,
    /// `>`
    Gt,
    /// `<=`
    Le,
    /// `>=`
    Ge,
    /// `->`
    Arrow,
    /// `=>`
    FatArrow,
    /// `||`
    OrOr,
    /// `&&`
    AndAnd,
    /// `!`
    Bang,
    /// `.`
    Dot,

    // ── Delimiters ────────────────────────────────────────────
    /// `(`
    LParen,
    /// `)`
    RParen,
    /// `{`
    LBrace,
    /// `}`
    RBrace,
    /// `[`
    LBracket,
    /// `]`
    RBracket,

    // ── Separators ────────────────────────────────────────────
    /// `;`
    Semi,
    /// `:`
    Colon,
    /// `,`
    Comma,

    // ── End ───────────────────────────────────────────────────
    /// End of file.
    Eof,
}

impl TokenKind {
    /// If this token can be used as a name (identifier or soft keyword), return its text.
    #[must_use]
    pub fn as_name(&self) -> Option<&str> {
        match self {
            TokenKind::Ident(s) => Some(s.as_str()),
            TokenKind::Hp => Some("hp"),
            TokenKind::Mana => Some("mana"),
            TokenKind::Shield => Some("shield"),
            TokenKind::Int => Some("int"),
            TokenKind::Bool => Some("bool"),
            TokenKind::Str => Some("str"),
            TokenKind::Unit => Some("unit"),
            TokenKind::Entity => Some("entity"),
            TokenKind::Effect => Some("Effect"),
            TokenKind::SelfKw => Some("self"),
            TokenKind::Target => Some("target"),
            TokenKind::Caster => Some("caster"),
            TokenKind::Cost => Some("cost"),
            TokenKind::On => Some("on"),
            TokenKind::Cast => Some("cast"),
            TokenKind::When => Some("when"),
            TokenKind::If => Some("if"),
            TokenKind::Else => Some("else"),
            TokenKind::Let => Some("let"),
            TokenKind::Fn => Some("fn"),
            TokenKind::Return => Some("return"),
            TokenKind::Pure => Some("pure"),
            TokenKind::Random => Some("random"),
            TokenKind::Mutating => Some("mutating"),
            TokenKind::Card => Some("card"),
            TokenKind::Ability => Some("ability"),
            TokenKind::Stats => Some("stats"),
            TokenKind::Passive => Some("passive"),
            TokenKind::Module => Some("module"),
            TokenKind::Use => Some("use"),
            TokenKind::Const => Some("const"),
            TokenKind::Damage => Some("damage"),
            TokenKind::Heal => Some("heal"),
            TokenKind::Apply => Some("apply"),
            TokenKind::TurnStart => Some("turn_start"),
            TokenKind::TurnEnd => Some("turn_end"),
            _ => None,
        }
    }
}

impl std::fmt::Display for TokenKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            TokenKind::IntLit(n) => write!(f, "{n}"),
            TokenKind::BoolLit(b) => write!(f, "{b}"),
            TokenKind::StrLit(s) => write!(f, "\"{s}\""),
            TokenKind::Ident(s) => write!(f, "{s}"),
            _ => {
                let s = match self {
                    TokenKind::Card => "card",
                    TokenKind::Ability => "ability",
                    TokenKind::Stats => "stats",
                    TokenKind::On => "on",
                    TokenKind::Cast => "cast",
                    TokenKind::When => "when",
                    TokenKind::If => "if",
                    TokenKind::Else => "else",
                    TokenKind::Let => "let",
                    TokenKind::Fn => "fn",
                    TokenKind::Pure => "pure",
                    TokenKind::Random => "random",
                    TokenKind::Mutating => "mutating",
                    TokenKind::Effect => "effect",
                    TokenKind::Int => "int",
                    TokenKind::Bool => "bool",
                    TokenKind::Str => "str",
                    TokenKind::Unit => "unit",
                    TokenKind::Entity => "entity",
                    TokenKind::Damage => "damage",
                    TokenKind::Heal => "heal",
                    TokenKind::Shield => "shield",
                    TokenKind::Apply => "apply",
                    TokenKind::SelfKw => "self",
                    TokenKind::Target => "target",
                    TokenKind::Caster => "caster",
                    TokenKind::Return => "return",
                    TokenKind::Cost => "cost",
                    TokenKind::Mana => "mana",
                    TokenKind::Hp => "hp",
                    TokenKind::TurnStart => "turn_start",
                    TokenKind::TurnEnd => "turn_end",
                    TokenKind::Module => "module",
                    TokenKind::Passive => "passive",
                    TokenKind::Use => "use",
                    TokenKind::Const => "const",
                    TokenKind::Plus => "+",
                    TokenKind::Minus => "-",
                    TokenKind::Star => "*",
                    TokenKind::Slash => "/",
                    TokenKind::Percent => "%",
                    TokenKind::Eq => "=",
                    TokenKind::EqEq => "==",
                    TokenKind::BangEq => "!=",
                    TokenKind::Lt => "<",
                    TokenKind::Gt => ">",
                    TokenKind::Le => "<=",
                    TokenKind::Ge => ">=",
                    TokenKind::Arrow => "->",
                    TokenKind::FatArrow => "=>",
                    TokenKind::OrOr => "||",
                    TokenKind::AndAnd => "&&",
                    TokenKind::Bang => "!",
                    TokenKind::Dot => ".",
                    TokenKind::LParen => "(",
                    TokenKind::RParen => ")",
                    TokenKind::LBrace => "{",
                    TokenKind::RBrace => "}",
                    TokenKind::LBracket => "[",
                    TokenKind::RBracket => "]",
                    TokenKind::Semi => ";",
                    TokenKind::Colon => ":",
                    TokenKind::Comma => ",",
                    TokenKind::Eof => "EOF",
                    _ => unreachable!("already handled above"),
                };
                write!(f, "{s}")
            }
        }
    }
}

/// A lexical token with kind and position information.
#[derive(Debug, Clone)]
pub struct Token {
    /// The kind of token.
    pub kind: TokenKind,
    /// Source span (byte offsets).
    pub span: Span,
}

impl PartialEq for Token {
    fn eq(&self, other: &Self) -> bool {
        self.kind == other.kind
    }
}

impl Eq for Token {}

/// Map of keyword strings to their token kinds.
fn keyword_map() -> &'static [(&'static str, TokenKind); 36] {
    &[
        ("card", TokenKind::Card),
        ("ability", TokenKind::Ability),
        ("stats", TokenKind::Stats),
        ("on", TokenKind::On),
        ("cast", TokenKind::Cast),
        ("when", TokenKind::When),
        ("if", TokenKind::If),
        ("else", TokenKind::Else),
        ("let", TokenKind::Let),
        ("fn", TokenKind::Fn),
        ("pure", TokenKind::Pure),
        ("random", TokenKind::Random),
        ("mutating", TokenKind::Mutating),
        ("effect", TokenKind::Effect),
        ("int", TokenKind::Int),
        ("bool", TokenKind::Bool),
        ("str", TokenKind::Str),
        ("unit", TokenKind::Unit),
        ("entity", TokenKind::Entity),
        ("damage", TokenKind::Damage),
        ("heal", TokenKind::Heal),
        ("shield", TokenKind::Shield),
        ("apply", TokenKind::Apply),
        ("self", TokenKind::SelfKw),
        ("target", TokenKind::Target),
        ("caster", TokenKind::Caster),
        ("return", TokenKind::Return),
        ("cost", TokenKind::Cost),
        ("mana", TokenKind::Mana),
        ("hp", TokenKind::Hp),
        ("turn_start", TokenKind::TurnStart),
        ("turn_end", TokenKind::TurnEnd),
        ("module", TokenKind::Module),
        ("passive", TokenKind::Passive),
        ("use", TokenKind::Use),
        ("const", TokenKind::Const),
    ]
}

/// Lookup a keyword string.
fn lookup_keyword(word: &str) -> Option<TokenKind> {
    keyword_map()
        .iter()
        .find(|(k, _)| *k == word)
        .map(|(_, v)| v.clone())
}

/// The Apolon lexer.
pub struct Lexer {
    source: Vec<char>,
    pos: usize,
}

impl Lexer {
    /// Create a new lexer for the given source string.
    #[must_use]
    pub fn new(source: &str) -> Self {
        Self {
            source: source.chars().collect(),
            pos: 0,
        }
    }

    /// Tokenize the entire source, returning tokens or lexical errors.
    pub fn tokenize(&mut self) -> Result<Vec<Token>, Vec<crate::error::CompileError>> {
        let mut tokens = Vec::new();
        let mut errors = Vec::new();

        while self.pos < self.source.len() {
            self.skip_whitespace_and_comments();
            if self.pos >= self.source.len() {
                break;
            }

            let start = self.pos;
            match self.peek() {
                Some(c) if c.is_ascii_digit() => {
                    tokens.push(self.lex_number(start));
                }
                Some('"') => {
                    match self.lex_string(start) {
                        Ok(tok) => tokens.push(tok),
                        Err(e) => errors.push(e),
                    }
                }
                Some(c) if c.is_ascii_alphabetic() || c == '_' => {
                    tokens.push(self.lex_ident_or_keyword(start));
                }
                Some('/') if self.peek_at(1) == Some('/') => {
                    self.skip_line_comment();
                }
                Some('/') if self.peek_at(1) == Some('*') => {
                    self.skip_block_comment();
                }
                _ => match self.lex_operator_or_punct(start) {
                    Ok(tok) => tokens.push(tok),
                    Err(e) => errors.push(e),
                },
            }
        }

        tokens.push(Token {
            kind: TokenKind::Eof,
            span: Span::new(self.pos, self.pos + 1),
        });

        if errors.is_empty() {
            Ok(tokens)
        } else {
            Err(errors)
        }
    }

    fn peek(&self) -> Option<char> {
        self.source.get(self.pos).copied()
    }

    fn peek_at(&self, offset: usize) -> Option<char> {
        self.source.get(self.pos + offset).copied()
    }

    fn advance_char(&mut self) -> Option<char> {
        let c = self.source.get(self.pos).copied();
        self.pos += 1;
        c
    }

    fn skip_whitespace_and_comments(&mut self) {
        loop {
            if self.pos >= self.source.len() {
                break;
            }
            match self.peek() {
                Some(c) if c.is_whitespace() => {
                    self.advance_char();
                }
                Some('/') if self.peek_at(1) == Some('/') => {
                    self.skip_line_comment();
                }
                Some('/') if self.peek_at(1) == Some('*') => {
                    self.skip_block_comment();
                }
                _ => break,
            }
        }
    }

    fn skip_line_comment(&mut self) {
        while let Some(c) = self.advance_char() {
            if c == '\n' {
                break;
            }
        }
    }

    fn skip_block_comment(&mut self) {
        self.advance_char(); // '/'
        self.advance_char(); // '*'
        while self.pos < self.source.len() {
            if self.peek() == Some('*') && self.peek_at(1) == Some('/') {
                self.advance_char();
                self.advance_char();
                return;
            }
            self.advance_char();
        }
    }

    fn lex_number(&mut self, start: usize) -> Token {
        let mut num_str = String::new();
        while let Some(c) = self.peek() {
            if c.is_ascii_digit() {
                num_str.push(c);
                self.advance_char();
            } else {
                break;
            }
        }
        let value: i64 = num_str.parse().unwrap_or(0);
        Token {
            kind: TokenKind::IntLit(value),
            span: Span::new(start, self.pos),
        }
    }

    fn lex_string(&mut self, start: usize) -> Result<Token, crate::error::CompileError> {
        self.advance_char(); // opening '"'
        let mut content = String::new();
        while let Some(c) = self.advance_char() {
            match c {
                '"' => {
                    return Ok(Token {
                        kind: TokenKind::StrLit(content),
                        span: Span::new(start, self.pos),
                    });
                }
                '\\' => {
                    let escaped = match self.advance_char() {
                        Some('n') => '\n',
                        Some('t') => '\t',
                        Some('\\') => '\\',
                        Some('"') => '"',
                        Some('x') => {
                            let hi = self.advance_char().unwrap_or('0');
                            let lo = self.advance_char().unwrap_or('0');
                            let val = u8::from_str_radix(&format!("{hi}{lo}"), 16).unwrap_or(0);
                            char::from(val)
                        }
                        Some(other) => other,
                        None => '\0',
                    };
                    content.push(escaped);
                }
                _ => {
                    content.push(c);
                }
            }
        }
        Err(crate::error::CompileError::new(
            Span::new(start, self.pos),
            "unterminated string literal",
        ))
    }

    fn lex_ident_or_keyword(&mut self, start: usize) -> Token {
        let mut word = String::new();
        while let Some(c) = self.peek() {
            if c.is_ascii_alphanumeric() || c == '_' || c == '-' {
                word.push(c);
                self.advance_char();
            } else {
                break;
            }
        }

        if word == "true" {
            return Token {
                kind: TokenKind::BoolLit(true),
                span: Span::new(start, self.pos),
            };
        }
        if word == "false" {
            return Token {
                kind: TokenKind::BoolLit(false),
                span: Span::new(start, self.pos),
            };
        }

        let kind = lookup_keyword(&word).unwrap_or(TokenKind::Ident(word));
        Token {
            kind,
            span: Span::new(start, self.pos),
        }
    }

    fn lex_operator_or_punct(&mut self, start: usize) -> Result<Token, crate::error::CompileError> {
        let c = self.advance_char().unwrap_or('\0');
        let kind = match c {
            '+' => TokenKind::Plus,
            '-' => {
                if self.peek() == Some('>') {
                    self.advance_char();
                    TokenKind::Arrow
                } else {
                    TokenKind::Minus
                }
            }
            '*' => TokenKind::Star,
            '/' => TokenKind::Slash,
            '%' => TokenKind::Percent,
            '=' => {
                if self.peek() == Some('=') {
                    self.advance_char();
                    TokenKind::EqEq
                } else if self.peek() == Some('>') {
                    self.advance_char();
                    TokenKind::FatArrow
                } else {
                    TokenKind::Eq
                }
            }
            '!' => {
                if self.peek() == Some('=') {
                    self.advance_char();
                    TokenKind::BangEq
                } else {
                    TokenKind::Bang
                }
            }
            '<' => {
                if self.peek() == Some('=') {
                    self.advance_char();
                    TokenKind::Le
                } else {
                    TokenKind::Lt
                }
            }
            '>' => {
                if self.peek() == Some('=') {
                    self.advance_char();
                    TokenKind::Ge
                } else {
                    TokenKind::Gt
                }
            }
            '|' => {
                if self.peek() == Some('|') {
                    self.advance_char();
                    TokenKind::OrOr
                } else {
                    return Err(crate::error::CompileError::new(
                        Span::new(start, self.pos),
                        "unexpected character '|'",
                    ));
                }
            }
            '&' => {
                if self.peek() == Some('&') {
                    self.advance_char();
                    TokenKind::AndAnd
                } else {
                    return Err(crate::error::CompileError::new(
                        Span::new(start, self.pos),
                        "unexpected character '&'",
                    ));
                }
            }
            '(' => TokenKind::LParen,
            ')' => TokenKind::RParen,
            '{' => TokenKind::LBrace,
            '}' => TokenKind::RBrace,
            '[' => TokenKind::LBracket,
            ']' => TokenKind::RBracket,
            ';' => TokenKind::Semi,
            ':' => TokenKind::Colon,
            ',' => TokenKind::Comma,
            '.' => TokenKind::Dot,
            _ => {
                return Err(crate::error::CompileError::new(
                    Span::new(start, self.pos),
                    format!("unexpected character '{c}'"),
                ));
            }
        };

        Ok(Token {
            kind,
            span: Span::new(start, self.pos),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_input() {
        let mut lexer = Lexer::new("");
        let tokens = lexer.tokenize().unwrap();
        assert_eq!(tokens.len(), 1);
        assert_eq!(tokens[0].kind, TokenKind::Eof);
    }

    #[test]
    fn test_keywords() {
        let mut lexer = Lexer::new("card ability if else let fn return true false");
        let tokens = lexer.tokenize().unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Card);
        assert_eq!(tokens[1].kind, TokenKind::Ability);
        assert_eq!(tokens[2].kind, TokenKind::If);
        assert_eq!(tokens[3].kind, TokenKind::Else);
        assert_eq!(tokens[4].kind, TokenKind::Let);
        assert_eq!(tokens[5].kind, TokenKind::Fn);
        assert_eq!(tokens[6].kind, TokenKind::Return);
        assert_eq!(tokens[7].kind, TokenKind::BoolLit(true));
        assert_eq!(tokens[8].kind, TokenKind::BoolLit(false));
    }

    #[test]
    fn test_integer_literal() {
        let mut lexer = Lexer::new("42 0 12345");
        let tokens = lexer.tokenize().unwrap();
        assert_eq!(tokens[0].kind, TokenKind::IntLit(42));
        assert_eq!(tokens[1].kind, TokenKind::IntLit(0));
        assert_eq!(tokens[2].kind, TokenKind::IntLit(12345));
    }

    #[test]
    fn test_string_literal() {
        let mut lexer = Lexer::new(r#""hello" "world""#);
        let tokens = lexer.tokenize().unwrap();
        assert_eq!(tokens[0].kind, TokenKind::StrLit("hello".into()));
        assert_eq!(tokens[1].kind, TokenKind::StrLit("world".into()));
    }

    #[test]
    fn test_identifiers() {
        let mut lexer = Lexer::new("foo bar-baz _hello x1");
        let tokens = lexer.tokenize().unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Ident("foo".into()));
        assert_eq!(tokens[1].kind, TokenKind::Ident("bar-baz".into()));
        assert_eq!(tokens[2].kind, TokenKind::Ident("_hello".into()));
        assert_eq!(tokens[3].kind, TokenKind::Ident("x1".into()));
    }

    #[test]
    fn test_operators() {
        let mut lexer = Lexer::new("+ - * / % = == != < > <= >= -> => || && ! .");
        let tokens = lexer.tokenize().unwrap();
        let expected_kinds = [
            TokenKind::Plus,
            TokenKind::Minus,
            TokenKind::Star,
            TokenKind::Slash,
            TokenKind::Percent,
            TokenKind::Eq,
            TokenKind::EqEq,
            TokenKind::BangEq,
            TokenKind::Lt,
            TokenKind::Gt,
            TokenKind::Le,
            TokenKind::Ge,
            TokenKind::Arrow,
            TokenKind::FatArrow,
            TokenKind::OrOr,
            TokenKind::AndAnd,
            TokenKind::Bang,
            TokenKind::Dot,
        ];
        for (tok, expected) in tokens.iter().zip(expected_kinds.iter()) {
            assert_eq!(tok.kind, *expected);
        }
    }

    #[test]
    fn test_delimiters() {
        let mut lexer = Lexer::new("( ) { } [ ] ; : ,");
        let tokens = lexer.tokenize().unwrap();
        let expected_kinds = [
            TokenKind::LParen,
            TokenKind::RParen,
            TokenKind::LBrace,
            TokenKind::RBrace,
            TokenKind::LBracket,
            TokenKind::RBracket,
            TokenKind::Semi,
            TokenKind::Colon,
            TokenKind::Comma,
        ];
        for (tok, expected) in tokens.iter().zip(expected_kinds.iter()) {
            assert_eq!(tok.kind, *expected);
        }
    }

    #[test]
    fn test_line_comment() {
        let mut lexer = Lexer::new("42 // this is a comment\n 10");
        let tokens = lexer.tokenize().unwrap();
        assert_eq!(tokens[0].kind, TokenKind::IntLit(42));
        assert_eq!(tokens[1].kind, TokenKind::IntLit(10));
    }

    #[test]
    fn test_block_comment() {
        let mut lexer = Lexer::new("42 /* comment */ 10");
        let tokens = lexer.tokenize().unwrap();
        assert_eq!(tokens[0].kind, TokenKind::IntLit(42));
        assert_eq!(tokens[1].kind, TokenKind::IntLit(10));
    }

    #[test]
    fn test_spans() {
        let mut lexer = Lexer::new("  hello  ");
        let tokens = lexer.tokenize().unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Ident("hello".into()));
        assert_eq!(tokens[0].span.start, 2);
        assert_eq!(tokens[0].span.end, 7);
    }

    #[test]
    fn test_soft_keywords() {
        let mut lexer = Lexer::new("hp mana shield self target caster");
        let tokens = lexer.tokenize().unwrap();
        assert_eq!(tokens[0].kind, TokenKind::Hp);
        assert_eq!(tokens[1].kind, TokenKind::Mana);
        assert_eq!(tokens[2].kind, TokenKind::Shield);
        assert_eq!(tokens[3].kind, TokenKind::SelfKw);
        assert_eq!(tokens[4].kind, TokenKind::Target);
        assert_eq!(tokens[5].kind, TokenKind::Caster);
    }
}

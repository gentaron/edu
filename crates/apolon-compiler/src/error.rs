//! Compile error types for the Apolon DSL compiler.

/// A span of source text, identified by byte offsets.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Span {
    /// Inclusive start byte offset.
    pub start: usize,
    /// Exclusive end byte offset.
    pub end: usize,
}

impl Span {
    /// Create a new span from start and end byte offsets.
    #[must_use]
    pub const fn new(start: usize, end: usize) -> Self {
        Self { start, end }
    }

    /// Create a zero-width span at a given offset.
    #[must_use]
    pub const fn at(offset: usize) -> Self {
        Self {
            start: offset,
            end: offset,
        }
    }

    /// Merge two spans into one that covers both.
    #[must_use]
    pub fn merge(self, other: Span) -> Span {
        Span {
            start: self.start.min(other.start),
            end: self.end.max(other.end),
        }
    }
}

impl std::fmt::Display for Span {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}..{}", self.start, self.end)
    }
}

/// A compilation error with position information.
#[derive(Debug, Clone)]
pub struct CompileError {
    /// The span in source where the error occurred.
    pub span: Span,
    /// Human-readable error message.
    pub message: String,
}

impl CompileError {
    /// Create a new compile error at the given span.
    #[must_use]
    pub fn new(span: Span, message: impl Into<String>) -> Self {
        Self {
            span,
            message: message.into(),
        }
    }
}

impl std::fmt::Display for CompileError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "error at {}: {}", self.span, self.message)
    }
}

impl std::error::Error for CompileError {}

impl PartialEq for CompileError {
    fn eq(&self, other: &Self) -> bool {
        self.span == other.span && self.message == other.message
    }
}

impl Eq for CompileError {}

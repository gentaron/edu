//! Source span tracking for the Apolon compiler.
//!
//! Provides [`Span`] and [`Spanned<T>`] types for tracking line/column
//! information throughout the compilation pipeline for error reporting.

use std::fmt;

/// A region of source code identified by start and end positions.
///
/// Positions are zero-based byte offsets. The span covers bytes
/// `[start, end)` (half-open interval).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Span {
    /// Byte offset of the first character in the span.
    pub start: usize,
    /// Byte offset one past the last character in the span.
    pub end: usize,
    /// Start line number (1-based).
    pub start_line: u32,
    /// Start column number (1-based).
    pub start_col: u32,
    /// End line number (1-based).
    pub end_line: u32,
    /// End column number (1-based).
    pub end_col: u32,
}

impl Span {
    /// Create a new span with only byte offsets (line/column set to 0).
    pub fn new(start: usize, end: usize) -> Self {
        Self {
            start,
            end,
            start_line: 0,
            start_col: 0,
            end_line: 0,
            end_col: 0,
        }
    }

    /// Create a fully-qualified span with line and column information.
    #[must_use]
    pub fn with_line_col(
        start: usize,
        end: usize,
        start_line: u32,
        start_col: u32,
        end_line: u32,
        end_col: u32,
    ) -> Self {
        Self {
            start,
            end,
            start_line,
            start_col,
            end_line,
            end_col,
        }
    }

    /// Create a span that covers both `self` and `other`.
    #[must_use]
    pub fn merge(&self, other: Span) -> Span {
        Span {
            start: self.start.min(other.start),
            end: self.end.max(other.end),
            start_line: self.start_line.min(other.start_line),
            start_col: if self.start_line <= other.start_line {
                self.start_col
            } else {
                other.start_col
            },
            end_line: self.end_line.max(other.end_line),
            end_col: if self.end_line >= other.end_line {
                self.end_col
            } else {
                other.end_col
            },
        }
    }

    /// Create a dummy span (all zeros) for compiler-generated nodes.
    #[must_use]
    pub const fn dummy() -> Self {
        Self {
            start: 0,
            end: 0,
            start_line: 0,
            start_col: 0,
            end_line: 0,
            end_col: 0,
        }
    }

    /// Length of the span in bytes.
    #[must_use]
    pub fn len(&self) -> usize {
        self.end.saturating_sub(self.start)
    }

    /// Returns true if the span has zero length.
    #[must_use]
    pub fn is_empty(&self) -> bool {
        self.start >= self.end
    }
}

impl fmt::Display for Span {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        if self.start_line > 0 {
            write!(f, "{}:{}", self.start_line, self.start_col)
        } else {
            write!(f, "byte {}", self.start)
        }
    }
}

/// A value paired with its source span.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Spanned<T> {
    pub node: T,
    pub span: Span,
}

impl<T> Spanned<T> {
    /// Create a new spanned value.
    pub fn new(node: T, span: Span) -> Self {
        Self { node, span }
    }

    /// Map over the inner value, keeping the same span.
    pub fn map<U, F>(self, f: F) -> Spanned<U>
    where
        F: FnOnce(T) -> U,
    {
        Spanned {
            node: f(self.node),
            span: self.span,
        }
    }
}

impl<T: fmt::Display> fmt::Display for Spanned<T> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} at {}", self.node, self.span)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn span_new_basic() {
        let s = Span::new(10, 20);
        assert_eq!(s.start, 10);
        assert_eq!(s.end, 20);
        assert_eq!(s.len(), 10);
        assert!(!s.is_empty());
    }

    #[test]
    fn span_empty() {
        let s = Span::new(5, 5);
        assert!(s.is_empty());
        assert_eq!(s.len(), 0);
    }

    #[test]
    fn span_with_line_col() {
        let s = Span::with_line_col(0, 10, 3, 5, 3, 15);
        assert_eq!(s.start_line, 3);
        assert_eq!(s.start_col, 5);
        assert_eq!(s.end_line, 3);
        assert_eq!(s.end_col, 15);
    }

    #[test]
    fn span_merge_same_line() {
        let a = Span::with_line_col(0, 5, 1, 1, 1, 6);
        let b = Span::with_line_col(10, 15, 1, 11, 1, 16);
        let c = a.merge(b);
        assert_eq!(c.start, 0);
        assert_eq!(c.end, 15);
        assert_eq!(c.start_line, 1);
        assert_eq!(c.end_line, 1);
    }

    #[test]
    fn span_merge_different_lines() {
        let a = Span::with_line_col(0, 5, 1, 1, 1, 6);
        let b = Span::with_line_col(20, 25, 3, 1, 3, 6);
        let c = a.merge(b);
        assert_eq!(c.start_line, 1);
        assert_eq!(c.end_line, 3);
    }

    #[test]
    fn span_dummy() {
        let d = Span::dummy();
        assert!(d.is_empty());
        assert_eq!(d.start, 0);
    }

    #[test]
    fn span_display_with_line() {
        let s = Span::with_line_col(0, 5, 10, 3, 10, 8);
        assert_eq!(format!("{s}"), "10:3");
    }

    #[test]
    fn span_display_without_line() {
        let s = Span::new(42, 45);
        assert_eq!(format!("{s}"), "byte 42");
    }

    #[test]
    fn spanned_new() {
        let s = Spanned::new(42, Span::new(0, 2));
        assert_eq!(s.node, 42);
        assert_eq!(s.span.start, 0);
    }

    #[test]
    fn spanned_map() {
        let s = Spanned::new(10, Span::new(0, 2));
        let mapped = s.map(|x| x * 2);
        assert_eq!(mapped.node, 20);
        assert_eq!(mapped.span.start, 0);
    }

    #[test]
    fn spanned_display() {
        let s = Spanned::new("hello", Span::with_line_col(0, 5, 1, 1, 1, 6));
        assert_eq!(format!("{s}"), "hello at 1:1");
    }

    #[test]
    fn span_clone_and_eq() {
        let a = Span::new(1, 5);
        let b = a;
        assert_eq!(a, b);
    }

    #[test]
    fn span_merge_reversed() {
        let a = Span::with_line_col(10, 15, 2, 1, 2, 6);
        let b = Span::with_line_col(0, 5, 1, 1, 1, 6);
        let c = a.merge(b);
        assert_eq!(c.start, 0);
        assert_eq!(c.end, 15);
        assert_eq!(c.start_line, 1);
    }
}

//! QASM-2 subset parser — zero-allocation, `no_std` compatible.
//!
//! Parses a restricted QASM 2.0 subset supporting:
//! - Register declarations: `qreg q[N];`, `creg c[N];`
//! - Gates: `h`, `x`, `z`, `cx` / `cnot`, `measure`
//!
//! # Contract (Creusot/Prusti)
//! ```text
//! requires input is valid UTF-8
//! ensures Ok(result) => result.n_qubits > 0
//! ensures Err(e) => e describes the parse failure
//! ```

use crate::{GateKind, Instruction, MAX_INSTRUCTIONS};

/// Errors that can occur during QASM parsing.
///
/// All variants are heap-free for `no_std` compatibility.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(u8)]
pub enum ParseError {
    /// The input string is empty or contains no valid statements.
    EmptyProgram,
    /// A statement has invalid syntax.
    InvalidSyntax,
    /// An unknown gate or keyword was encountered.
    UnknownGate,
    /// A qubit index exceeds the register size.
    QubitOutOfRange,
    /// Register declaration is malformed (e.g., missing brackets).
    InvalidRegister,
    /// Too many instructions (exceeds [`MAX_INSTRUCTIONS`]).
    TooManyInstructions,
    /// Control and target qubits are the same in CNOT.
    SameControlTarget,
    /// `n_qubits` would exceed 12.
    TooManyQubits,
}

impl core::fmt::Display for ParseError {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        match self {
            Self::EmptyProgram => write!(f, "empty program: no valid statements"),
            Self::InvalidSyntax => write!(f, "invalid syntax"),
            Self::UnknownGate => write!(f, "unknown gate or keyword"),
            Self::QubitOutOfRange => write!(f, "qubit index out of range"),
            Self::InvalidRegister => write!(f, "invalid register declaration"),
            Self::TooManyInstructions => write!(f, "too many instructions (max 256)"),
            Self::SameControlTarget => write!(f, "CNOT control and target must differ"),
            Self::TooManyQubits => write!(f, "too many qubits (max 12)"),
        }
    }
}

#[cfg(feature = "std")]
impl std::error::Error for ParseError {}

/// A parsed QASM program.
///
/// Stores all instructions in a fixed-size stack array.
///
/// # Contract (Creusot/Prusti)
/// ```text
/// ensures n_qubits > 0
/// ensures n_classical >= 0
/// ensures n_instructions <= MAX_INSTRUCTIONS
/// ```
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ParsedProgram {
    /// Number of quantum register bits.
    pub n_qubits: u8,
    /// Number of classical register bits.
    pub n_classical: u8,
    /// Parsed instructions.
    pub instructions: [Instruction; MAX_INSTRUCTIONS],
    /// Number of valid instructions.
    pub n_instructions: usize,
}

impl ParsedProgram {
    /// Create an empty parsed program.
    #[must_use]
    pub fn new() -> Self {
        Self {
            n_qubits: 0,
            n_classical: 0,
            instructions: [Instruction::none(); MAX_INSTRUCTIONS],
            n_instructions: 0,
        }
    }

    /// Add an instruction to the program.
    ///
    /// Returns `Err(ParseError::TooManyInstructions)` if the buffer is full.
    fn push(&mut self, instr: Instruction) -> Result<(), ParseError> {
        if self.n_instructions >= MAX_INSTRUCTIONS {
            return Err(ParseError::TooManyInstructions);
        }
        self.instructions[self.n_instructions] = instr;
        self.n_instructions += 1;
        Ok(())
    }
}

impl Default for ParsedProgram {
    fn default() -> Self {
        Self::new()
    }
}

/// Parse a QASM-2 subset string into a `ParsedProgram`.
///
/// # Supported Syntax
/// ```text
/// qreg q[N];
/// creg c[N];
/// h q[i];
/// x q[i];
/// z q[i];
/// cx q[i],q[j];       // or: cnot q[i],q[j];
/// measure q[i] -> c[j];
/// ```
///
/// # Errors
/// Returns `ParseError` for invalid input.
///
/// # Example
/// ```
/// let program = edu_quasi::parser::parse(
///     "qreg q[2]; creg c[2]; h q[0]; cx q[0],q[1]; measure q[0] -> c[0];"
/// ).unwrap();
/// assert_eq!(program.n_qubits, 2);
/// ```
pub fn parse(input: &str) -> Result<ParsedProgram, ParseError> {
    let mut program = ParsedProgram::new();

    for statement in input.split(';') {
        let stmt = statement.trim();
        if stmt.is_empty() {
            continue;
        }
        parse_statement(stmt, &mut program)?;
    }

    if program.n_qubits == 0 {
        return Err(ParseError::EmptyProgram);
    }

    Ok(program)
}

/// Parse a single QASM statement (without trailing semicolon).
///
/// Uses iterator-based tokenization — no heap allocation.
fn parse_statement(stmt: &str, program: &mut ParsedProgram) -> Result<(), ParseError> {
    let mut tokens = stmt.split_whitespace();

    let keyword = tokens.next().ok_or(ParseError::InvalidSyntax)?;

    match keyword {
        "qreg" => {
            let reg = tokens.next().ok_or(ParseError::InvalidRegister)?;
            parse_qreg(reg, program)
        }
        "creg" => {
            let reg = tokens.next().ok_or(ParseError::InvalidRegister)?;
            parse_creg(reg, program)
        }
        "h" => parse_single_qubit_gate(&mut tokens, program, GateKind::H),
        "x" => parse_single_qubit_gate(&mut tokens, program, GateKind::X),
        "z" => parse_single_qubit_gate(&mut tokens, program, GateKind::Z),
        "cx" | "cnot" => parse_cnot_gate(&mut tokens, program),
        "measure" => parse_measure(&mut tokens, program),
        _ => Err(ParseError::UnknownGate),
    }
}

/// Parse `qreg q[N];`
fn parse_qreg(reg_token: &str, program: &mut ParsedProgram) -> Result<(), ParseError> {
    let (name, size_str) = split_bracket(reg_token)?;
    if name != "q" {
        return Err(ParseError::InvalidRegister);
    }

    let size: u8 = parse_u8(size_str).map_err(|_| ParseError::InvalidRegister)?;
    if size == 0 || size > 12 {
        return Err(ParseError::TooManyQubits);
    }
    program.n_qubits = size;
    Ok(())
}

/// Parse `creg c[N];`
fn parse_creg(reg_token: &str, program: &mut ParsedProgram) -> Result<(), ParseError> {
    let (name, size_str) = split_bracket(reg_token)?;
    if name != "c" {
        return Err(ParseError::InvalidRegister);
    }

    let size: u8 = parse_u8(size_str).map_err(|_| ParseError::InvalidRegister)?;
    program.n_classical = size;
    Ok(())
}

/// Parse a single-qubit gate: `h q[i];`, `x q[i];`, `z q[i];`
fn parse_single_qubit_gate(
    tokens: &mut core::str::SplitWhitespace<'_>,
    program: &mut ParsedProgram,
    kind: GateKind,
) -> Result<(), ParseError> {
    let tok = tokens.next().ok_or(ParseError::InvalidSyntax)?;
    let qubit = parse_qubit_index(tok)?;
    if qubit >= program.n_qubits {
        return Err(ParseError::QubitOutOfRange);
    }

    program.push(Instruction {
        kind,
        arg0: qubit,
        arg1: 0,
    })
}

/// Parse `cx q[i],q[j];` or `cnot q[i],q[j];`
///
/// Handles two whitespace styles:
/// - `cx q[0],q[1]` → single token with comma
/// - `cx q[0] ,q[1]` → two tokens
fn parse_cnot_gate(
    tokens: &mut core::str::SplitWhitespace<'_>,
    program: &mut ParsedProgram,
) -> Result<(), ParseError> {
    let first = tokens.next().ok_or(ParseError::InvalidSyntax)?;

    // Check if comma is embedded in the first token (e.g., "q[0],q[1]")
    if let Some(comma_pos) = first.find(',') {
        let control = parse_qubit_index(&first[..comma_pos])?;
        let target = parse_qubit_index(&first[comma_pos + 1..])?;
        return validate_and_push_cnot(program, control, target);
    }

    let control = parse_qubit_index(first)?;
    let second = tokens.next().ok_or(ParseError::InvalidSyntax)?;
    let target = parse_qubit_index(second.trim_start_matches(','))?;
    validate_and_push_cnot(program, control, target)
}

/// Validate CNOT qubits and push the instruction.
fn validate_and_push_cnot(
    program: &mut ParsedProgram,
    control: u8,
    target: u8,
) -> Result<(), ParseError> {
    if control >= program.n_qubits || target >= program.n_qubits {
        return Err(ParseError::QubitOutOfRange);
    }
    if control == target {
        return Err(ParseError::SameControlTarget);
    }

    program.push(Instruction {
        kind: GateKind::Cnot,
        arg0: control,
        arg1: target,
    })
}

/// Parse `measure q[i] -> c[j];`
fn parse_measure(
    tokens: &mut core::str::SplitWhitespace<'_>,
    program: &mut ParsedProgram,
) -> Result<(), ParseError> {
    let q_tok = tokens.next().ok_or(ParseError::InvalidSyntax)?;
    let arrow = tokens.next().ok_or(ParseError::InvalidSyntax)?;
    let c_tok = tokens.next().ok_or(ParseError::InvalidSyntax)?;

    if arrow != "->" {
        return Err(ParseError::InvalidSyntax);
    }

    let qubit = parse_qubit_index(q_tok)?;
    let _cbit = parse_qubit_index(c_tok)?;

    if qubit >= program.n_qubits {
        return Err(ParseError::QubitOutOfRange);
    }

    program.push(Instruction {
        kind: GateKind::Measure,
        arg0: qubit,
        arg1: 0,
    })
}

/// Parse `q[i]` into qubit index `i`.
fn parse_qubit_index(token: &str) -> Result<u8, ParseError> {
    let token = token.trim_end_matches(',');
    let (name, idx_str) = split_bracket(token)?;
    if name != "q" && name != "c" {
        return Err(ParseError::InvalidSyntax);
    }
    parse_u8(idx_str).map_err(|_| ParseError::InvalidSyntax)
}

/// Split `"q[5]"` into `("q", "5")`.
fn split_bracket(token: &str) -> Result<(&str, &str), ParseError> {
    let open = token.find('[').ok_or(ParseError::InvalidRegister)?;
    let close = token.find(']').ok_or(ParseError::InvalidRegister)?;
    if close <= open {
        return Err(ParseError::InvalidRegister);
    }
    Ok((&token[..open], &token[open + 1..close]))
}

/// Parse a `&str` as `u8`.
fn parse_u8(s: &str) -> Result<u8, ()> {
    let mut result: u8 = 0;
    for ch in s.bytes() {
        if !ch.is_ascii_digit() {
            return Err(());
        }
        result = result.checked_mul(10).ok_or(())?;
        result = result.checked_add(ch - b'0').ok_or(())?;
    }
    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::GateKind;

    #[test]
    fn test_parse_empty_string() {
        assert_eq!(parse(""), Err(ParseError::EmptyProgram));
    }

    #[test]
    fn test_parse_whitespace_only() {
        assert_eq!(parse("   "), Err(ParseError::EmptyProgram));
    }

    #[test]
    fn test_parse_qreg_only() {
        let p = parse("qreg q[3];").unwrap();
        assert_eq!(p.n_qubits, 3);
        assert_eq!(p.n_instructions, 0);
    }

    #[test]
    fn test_parse_qreg_creg() {
        let p = parse("qreg q[4]; creg c[4];").unwrap();
        assert_eq!(p.n_qubits, 4);
        assert_eq!(p.n_classical, 4);
    }

    #[test]
    fn test_parse_h_gate() {
        let p = parse("qreg q[2]; h q[0];").unwrap();
        assert_eq!(p.n_instructions, 1);
        assert_eq!(p.instructions[0].kind, GateKind::H);
        assert_eq!(p.instructions[0].arg0, 0);
    }

    #[test]
    fn test_parse_x_gate() {
        let p = parse("qreg q[3]; x q[2];").unwrap();
        assert_eq!(p.n_instructions, 1);
        assert_eq!(p.instructions[0].kind, GateKind::X);
        assert_eq!(p.instructions[0].arg0, 2);
    }

    #[test]
    fn test_parse_z_gate() {
        let p = parse("qreg q[1]; z q[0];").unwrap();
        assert_eq!(p.instructions[0].kind, GateKind::Z);
    }

    #[test]
    fn test_parse_cx_gate() {
        let p = parse("qreg q[3]; cx q[0],q[1];").unwrap();
        assert_eq!(p.n_instructions, 1);
        assert_eq!(p.instructions[0].kind, GateKind::Cnot);
        assert_eq!(p.instructions[0].arg0, 0);
        assert_eq!(p.instructions[0].arg1, 1);
    }

    #[test]
    fn test_parse_cnot_alias() {
        let p = parse("qreg q[2]; cnot q[0],q[1];").unwrap();
        assert_eq!(p.instructions[0].kind, GateKind::Cnot);
    }

    #[test]
    fn test_parse_measure() {
        let p = parse("qreg q[2]; creg c[2]; measure q[0] -> c[0];").unwrap();
        assert_eq!(p.n_instructions, 1);
        assert_eq!(p.instructions[0].kind, GateKind::Measure);
        assert_eq!(p.instructions[0].arg0, 0);
    }

    #[test]
    fn test_parse_full_program() {
        let p = parse(
            "qreg q[2]; creg c[2]; h q[0]; cx q[0],q[1]; measure q[0] -> c[0]; measure q[1] -> c[1];",
        )
        .unwrap();
        assert_eq!(p.n_qubits, 2);
        assert_eq!(p.n_classical, 2);
        assert_eq!(p.n_instructions, 4);
        assert_eq!(p.instructions[0].kind, GateKind::H);
        assert_eq!(p.instructions[1].kind, GateKind::Cnot);
        assert_eq!(p.instructions[2].kind, GateKind::Measure);
        assert_eq!(p.instructions[3].kind, GateKind::Measure);
    }

    #[test]
    fn test_parse_unknown_gate() {
        let result = parse("qreg q[1]; ry q[0];");
        assert_eq!(result, Err(ParseError::UnknownGate));
    }

    #[test]
    fn test_parse_qubit_out_of_range() {
        let result = parse("qreg q[2]; h q[5];");
        assert_eq!(result, Err(ParseError::QubitOutOfRange));
    }

    #[test]
    fn test_parse_invalid_register() {
        let result = parse("qreg x;");
        assert_eq!(result, Err(ParseError::InvalidRegister));
    }

    #[test]
    fn test_parse_no_semicolons_parses_qreg() {
        // Without semicolons, the parser still parses qreg declarations
        let p = parse("qreg q[1]").unwrap();
        assert_eq!(p.n_qubits, 1);
        assert_eq!(p.n_instructions, 0);
    }

    #[test]
    fn test_parse_cnot_same_qubit() {
        let result = parse("qreg q[2]; cx q[0],q[0];");
        assert_eq!(result, Err(ParseError::SameControlTarget));
    }

    #[test]
    fn test_parse_too_many_qubits() {
        let result = parse("qreg q[13];");
        assert_eq!(result, Err(ParseError::TooManyQubits));
    }

    #[test]
    fn test_parse_complex_program() {
        let p = parse(
            "qreg q[3]; creg c[3]; h q[0]; h q[1]; x q[2]; cx q[0],q[1]; z q[2]; measure q[0] -> c[0];",
        )
        .unwrap();
        assert_eq!(p.n_qubits, 3);
        assert_eq!(p.n_instructions, 6);
        assert_eq!(p.instructions[5].kind, GateKind::Measure);
    }

    #[test]
    fn test_parse_display_error() {
        let err = ParseError::EmptyProgram;
        // Verify Display impl by checking it contains meaningful text
        use core::fmt::Write;
        struct Buf([u8; 64]);
        impl Write for Buf {
            fn write_str(&mut self, s: &str) -> core::fmt::Result {
                let bytes = s.as_bytes();
                let end = bytes.len().min(self.0.len());
                self.0[..end].copy_from_slice(&bytes[..end]);
                Ok(())
            }
        }
        let mut buf = Buf([0u8; 64]);
        let _ = write!(&mut buf, "{err}");
        // Check that something was written (non-null bytes)
        assert!(buf.0[0] != 0);
    }

    #[test]
    fn test_parse_multiple_registers_single_line() {
        let p = parse("qreg q[2]; creg c[2];").unwrap();
        assert_eq!(p.n_qubits, 2);
        assert_eq!(p.n_classical, 2);
        assert_eq!(p.n_instructions, 0);
    }

    #[test]
    fn test_parse_cx_with_spaces() {
        // "cx q[0] ,q[1]" → two separate tokens
        let p = parse("qreg q[3]; cx q[0] ,q[1];").unwrap();
        assert_eq!(p.instructions[0].kind, GateKind::Cnot);
        assert_eq!(p.instructions[0].arg0, 0);
        assert_eq!(p.instructions[0].arg1, 1);
    }

    #[test]
    fn test_parse_measure_shorthand() {
        let p = parse("qreg q[2]; creg c[2]; measure q[0] -> c[0];").unwrap();
        assert_eq!(p.n_instructions, 1);
        assert_eq!(p.instructions[0].kind, GateKind::Measure);
    }

    #[test]
    fn test_parse_gate_kind_discriminants() {
        assert_eq!(GateKind::H as u8, 0);
        assert_eq!(GateKind::X as u8, 1);
        assert_eq!(GateKind::Z as u8, 2);
        assert_eq!(GateKind::Cnot as u8, 3);
        assert_eq!(GateKind::Measure as u8, 4);
    }

    #[test]
    fn test_parse_zero_qubits_rejected() {
        let result = parse("qreg q[0];");
        assert_eq!(result, Err(ParseError::TooManyQubits));
    }

    #[test]
    fn test_parse_multiple_same_gates() {
        let p = parse("qreg q[3]; h q[0]; h q[1]; h q[2];").unwrap();
        assert_eq!(p.n_instructions, 3);
        for i in 0..3 {
            assert_eq!(p.instructions[i].kind, GateKind::H);
            assert_eq!(p.instructions[i].arg0, i as u8);
        }
    }
}

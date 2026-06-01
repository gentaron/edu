/**
 * Tree-sitter grammar for the Apolon DSL
 *
 * Apolon is a statically-typed, purely-functional DSL for defining card
 * abilities and battle effects in the EDU battle engine. It compiles to
 * WASM 2.0 via an SSA IR intermediate representation.
 *
 * Precedence levels (lower = binds less tightly):
 *   1  |        effect alternative
 *   2  >>       effect bind (right-assoc)
 *   3  ||       logical or
 *   4  &&       logical and
 *   5  == != < > <= >=  comparison
 *   6  + -      addition / subtraction
 *   7  * / %    multiplication / division / modulo
 *   8  ::       cons (right-assoc)
 *   9  |> .     pipe / field access
 *  10  f(...)   function application
 *  11  - !      unary prefix
 */

const PREC = {
  ALT:          1,   // |  effect alternative
  BIND:         2,   // >> effect bind (right-assoc)
  LOGICAL_OR:   3,   // ||
  LOGICAL_AND:  4,   // &&
  COMPARE:      5,   // == != < > <= >=
  ADD:          6,   // + -
  MUL:          7,   // * / %
  CONS:         8,   // :: (right-assoc)
  PIPE:         9,   // |> and .
  APPLICATION:  10,  // function call
  UNARY:        11,  // prefix - !
};

module.exports = grammar({
  name: 'apolon',

  extras: $ => [
    $.comment,
    /\s/,
  ],

  conflicts: $ => [
    [$.expr, $.type_expr],
    [$.record_literal, $.record_type],
    [$.stmt],
    [$.tuple_type, $.paren_type],
    [$.effect_clause, $.expr],
  ],

  rules: {

    // ══════════════════════════════════════════════
    //  Program & Module
    // ══════════════════════════════════════════════

    program: $ => repeat($.module_decl),

    module_decl: $ => seq(
      'module',
      field('name', $.module_path),
      '{',
      repeat(field('body', $.top_level)),
      '}',
    ),

    module_path: $ => seq(
      $.IDENT,
      repeat(seq('::', $.IDENT)),
    ),

    top_level: $ => choice(
      $.import_decl,
      $.card_decl,
      $.fn_decl,
      $.type_decl,
      $.alias_decl,
      $.effect_decl,
      $.let_decl,
      $.enum_decl,
    ),

    // ══════════════════════════════════════════════
    //  Import Declaration
    // ══════════════════════════════════════════════

    import_decl: $ => seq(
      'import',
      field('path', $.module_path),
      optional(choice(
        seq('as', field('alias', $.IDENT)),
        seq('(', $.import_item_list, ')'),
      )),
    ),

    import_item_list: $ => seq(
      $.IDENT,
      repeat(seq(',', $.IDENT)),
    ),

    // ══════════════════════════════════════════════
    //  Card Declaration
    // ══════════════════════════════════════════════

    card_decl: $ => seq(
      'card',
      field('name', $.IDENT),
      '{',
      repeat(field('field', $.card_field)),
      '}',
    ),

    card_field: $ => choice(
      $.card_meta_field,
      $.card_ability_decl,
    ),

    card_meta_field: $ => choice(
      seq('name',        '=', field('value', $.string)),
      seq('rarity',      '=', field('value', $.rarity)),
      seq('affiliation', '=', field('value', $.string)),
      seq('attack',      '=', field('value', $.integer)),
      seq('defense',     '=', field('value', $.integer)),
      seq('image_url',   '=', field('value', $.string)),
      seq('flavor_text', '=', field('value', $.string)),
    ),

    rarity: $ => choice('SR', 'R', 'C'),

    card_ability_decl: $ => seq(
      'ability',
      field('name', $.IDENT),
      '(',
      optional(field('params', $.param_list)),
      ')',
      field('effect', $.ability_effect),
    ),

    param_list: $ => seq(
      $.param,
      repeat(seq(',', $.param)),
    ),

    param: $ => seq(
      field('name', $.IDENT),
      ':',
      field('type', $.type_expr),
    ),

    ability_effect: $ => seq(
      ':',
      field('return_type', $.type_expr),
      '=',
      field('body', choice($.effect_expr, $.expr)),
    ),

    // ══════════════════════════════════════════════
    //  Effect Annotations
    // ══════════════════════════════════════════════

    effect_expr: $ => seq(
      'effect_',
      field('body', $.effect_body),
    ),

    effect_body: $ => seq(
      $.effect_clause,
      repeat(seq('|', $.effect_clause)),
    ),

    effect_clause: $ => seq(
      field('tag', $.effect_tag),
      '{',
      repeat(field('stmt', $.stmt)),
      '}',
    ),

    effect_tag: $ => choice('pure', 'view', 'mut'),

    // ══════════════════════════════════════════════
    //  Function Declaration
    // ══════════════════════════════════════════════

    fn_decl: $ => seq(
      optional(field('effect', $.effect_tag)),
      'fn',
      field('name', $.IDENT),
      optional(field('type_params', $.type_params)),
      '(',
      optional(field('params', $.param_list)),
      ')',
      optional(seq(':', field('return_type', $.type_expr))),
      optional(seq('where', field('constraints', $.constraint_list))),
      '=',
      field('body', $.expr),
    ),

    type_params: $ => seq(
      '[',
      $.IDENT,
      repeat(seq(',', $.IDENT)),
      ']',
    ),

    constraint_list: $ => seq(
      $.constraint,
      repeat(seq(',', $.constraint)),
    ),

    constraint: $ => seq(
      field('name', $.IDENT),
      ':',
      field('kind', $.kind_expr),
    ),

    kind_expr: $ => choice('Type', '*'),

    // ══════════════════════════════════════════════
    //  Type / Alias / Effect / Enum Declarations
    // ══════════════════════════════════════════════

    type_decl: $ => seq(
      'type',
      field('name', $.IDENT_U),
      optional(field('type_params', $.type_params)),
      '=',
      field('body', $.type_expr),
    ),

    alias_decl: $ => seq(
      'alias',
      field('name', $.IDENT_U),
      optional(field('type_params', $.type_params)),
      '=',
      field('body', $.type_expr),
    ),

    effect_decl: $ => seq(
      'effect',
      field('name', $.IDENT),
      '=',
      field('spec', $.effect_tag),
    ),

    enum_decl: $ => seq(
      'enum',
      field('name', $.IDENT_U),
      '{',
      repeat(field('variant', $.enum_variant)),
      '}',
    ),

    enum_variant: $ => seq(
      field('name', $.IDENT_U),
      '=',
      field('value', $.integer),
    ),

    // ══════════════════════════════════════════════
    //  Top-level Let Declaration
    // ══════════════════════════════════════════════

    let_decl: $ => seq(
      'let',
      field('name', $.IDENT),
      '=',
      field('value', $.expr),
    ),

    // ══════════════════════════════════════════════
    //  Type Expressions
    // ══════════════════════════════════════════════

    type_expr: $ => choice(
      // Base types (keywords)
      'Int',
      'Bool',
      'String',
      'Unit',
      // Named type / constructor
      $.IDENT_U,
      // Compound types
      $.arrow_type,
      $.record_type,
      $.list_type,
      $.row_extension_type,
      $.tuple_type,
      $.paren_type,
    ),

    arrow_type: $ => prec.right(PREC.BIND, seq(
      field('left', $.type_expr),
      '->',
      field('right', $.type_expr),
    )),

    record_type: $ => seq(
      '{',
      optional($.row_type),
      '}',
    ),

    row_type: $ => seq(
      $.row_field_type,
      repeat(seq(',', $.row_field_type)),
    ),

    row_field_type: $ => seq(
      '#',
      field('label', $.IDENT),
      ':',
      field('type', $.type_expr),
    ),

    list_type: $ => seq(
      '[',
      field('element', $.type_expr),
      ']',
    ),

    row_extension_type: $ => prec.left(PREC.ADD, seq(
      field('left', $.type_expr),
      '+',
      field('right', $.type_expr),
    )),

    tuple_type: $ => seq(
      '(',
      field('element', $.type_expr),
      repeat1(seq(',', field('element', $.type_expr))),
      ')',
    ),

    paren_type: $ => seq(
      '(',
      field('type', $.type_expr),
      ')',
    ),

    // ══════════════════════════════════════════════
    //  Expressions
    // ══════════════════════════════════════════════

    expr: $ => choice(
      // ── Literals ──
      $.integer,
      $.string,
      $.boolean,

      // ── Identifiers / constructors ──
      $.IDENT,
      $.IDENT_U,

      // ── Compound expressions ──
      $.paren_expr,
      $.list_literal,
      $.record_literal,
      $.if_expr,
      $.match_expr,
      $.let_expr,

      // ── Application (f(x, y)) ──
      prec(PREC.APPLICATION, seq(
        field('function', $.expr),
        '(',
        optional(field('arguments', $.arg_list)),
        ')',
      )),

      // ── Pipe (x |> f) ──
      prec.left(PREC.PIPE, seq(
        field('value', $.expr),
        '|>',
        field('function', $.IDENT),
      )),

      // ── Field access (x.field) ──
      prec.left(PREC.PIPE, seq(
        field('value', $.expr),
        '.',
        field('field', $.IDENT),
      )),

      // ── Cons (x :: xs, right-assoc) ──
      prec.right(PREC.CONS, seq(
        field('left', $.expr),
        '::',
        field('right', $.expr),
      )),

      // ── Unary prefix ──
      prec(PREC.UNARY, seq('-', field('operand', $.expr))),
      prec(PREC.UNARY, seq('!', field('operand', $.expr))),

      // ── Binary: multiplicative ──
      prec.left(PREC.MUL, seq(
        field('left', $.expr),
        field('operator', choice('*', '/', '%')),
        field('right', $.expr),
      )),

      // ── Binary: additive ──
      prec.left(PREC.ADD, seq(
        field('left', $.expr),
        field('operator', choice('+', '-')),
        field('right', $.expr),
      )),

      // ── Binary: comparison ──
      prec.left(PREC.COMPARE, seq(
        field('left', $.expr),
        field('operator', choice('==', '!=', '<', '>', '<=', '>=')),
        field('right', $.expr),
      )),

      // ── Binary: logical AND ──
      prec.left(PREC.LOGICAL_AND, seq(
        field('left', $.expr),
        '&&',
        field('right', $.expr),
      )),

      // ── Binary: logical OR ──
      prec.left(PREC.LOGICAL_OR, seq(
        field('left', $.expr),
        '||',
        field('right', $.expr),
      )),

      // ── Effect bind (>> , right-assoc) ──
      prec.right(PREC.BIND, seq(
        field('left', $.expr),
        '>>',
        field('right', $.expr),
      )),

      // ── Effect alternative (|) ──
      prec.left(PREC.ALT, seq(
        field('left', $.expr),
        '|',
        field('right', $.expr),
      )),
    ),

    // ── Expression helpers ──

    paren_expr: $ => seq('(', field('expression', $.expr), ')'),

    list_literal: $ => seq(
      '[',
      optional(seq(
        field('element', $.expr),
        repeat(seq(',', field('element', $.expr))),
      )),
      ']',
    ),

    record_literal: $ => seq(
      '{',
      optional(seq(
        $.record_field,
        repeat(seq(',', $.record_field)),
      )),
      '}',
    ),

    record_field: $ => seq(
      '#',
      field('label', $.IDENT),
      '=',
      field('value', $.expr),
    ),

    if_expr: $ => seq(
      'if',
      field('condition', $.expr),
      'then',
      field('consequence', $.expr),
      'else',
      field('alternative', $.expr),
    ),

    match_expr: $ => seq(
      'match',
      field('value', $.expr),
      '{',
      repeat(field('arm', $.match_arm)),
      '}',
    ),

    match_arm: $ => seq(
      field('pattern', $.pattern),
      '=>',
      field('body', $.expr),
    ),

    let_expr: $ => seq(
      'let',
      field('name', $.IDENT),
      '=',
      field('value', $.expr),
      'in',
      field('body', $.expr),
    ),

    arg_list: $ => seq(
      $.expr,
      repeat(seq(',', $.expr)),
    ),

    // ══════════════════════════════════════════════
    //  Patterns
    // ══════════════════════════════════════════════

    pattern: $ => choice(
      $.integer,
      $.string,
      $.boolean,
      $.IDENT,
      $.IDENT_U,
      '_',
      $.tuple_pattern,
    ),

    tuple_pattern: $ => seq(
      '(',
      $.pattern,
      repeat(seq(',', $.pattern)),
      ')',
    ),

    // ══════════════════════════════════════════════
    //  Statements (inside effect blocks)
    // ══════════════════════════════════════════════

    stmt: $ => choice(
      $.let_stmt,
      $.return_stmt,
      $.expr_stmt,
    ),

    let_stmt: $ => seq(
      'let',
      field('name', $.IDENT),
      optional(seq(':', field('type', $.type_expr))),
      '=',
      field('value', $.expr),
    ),

    return_stmt: $ => seq(
      'return',
      field('value', $.expr),
    ),

    expr_stmt: $ => $.expr,

    // ══════════════════════════════════════════════
    //  Literals
    // ══════════════════════════════════════════════

    integer: $ => /\d+/,

    string: $ => seq(
      '"',
      repeat(choice(
        /[^"\\]/,
        seq('\\', choice('n', 't', '\\', '"')),
      )),
      '"',
    ),

    boolean: $ => choice('true', 'false'),

    // ══════════════════════════════════════════════
    //  Identifiers
    // ══════════════════════════════════════════════

    IDENT:   $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    IDENT_U: $ => /[A-Z][a-zA-Z0-9_]*/,

    // ══════════════════════════════════════════════
    //  Comments
    // ══════════════════════════════════════════════

    comment: $ => token(choice(
      // Line comment
      seq('//', /[^\n]*/),
      // Block comment
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
    )),
  },
});

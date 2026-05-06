import Lake
open Lake DSL

package apolon where
  leanOptions := #[⟨`autoImplicit, false⟩]

@[default_target]
lean_lib Apolon where
  srcDir := ".."

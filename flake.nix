{
  description = "Svelte Application";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        packages = {
          default = pkgs.gnumake;
        };
        formatter = pkgs.nixpkgs-fmt;

        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            # build dependencies
            git

            nodejs
            yarn

            gnumake
          ];

          shellHook = ''
          '';
        };
        tasks = {
          serve = {
            description = "Start the Svelte development server";
            run = "yarn dev";
          };
        };
      }
    );
}

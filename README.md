
### How to Run This on Your Computer

Follow these steps to run iStat locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/istat-frontend.git
   ```

2. **Navigate into the project directory**:

   ```bash
   cd istat-frontend
   ```

3. **Install dependencies**:
   Make sure you have Node.js and npm installed. Then run:

   ```bash
   npm install
   ```

4. **Build for production**:
   To build the project for production, use:

   ```bash
   npm run dev
   ```

5. **Open the application**:
   Open your browser and navigate to:

```
http://localhost:3000
```

## Devenv instructions

Alternatively, `devenv` + [Nix](https://nixos.org/) can be used to
automatically bring up a working environment. Install Nix and enable the
experimental flakes feature. Enter the project directory and type

```bash
nix develop --impure
```

All dependencies will be fetched automatically. Once the command finishes, run

```bash
devenv up
```

A development server will be started at `localhost:5173`

# 🛠️ plz-create-me

**Your AI-powered project scaffolding companion.**
Let AI handle your initial project setup—so you can focus on building, not boilerplate.

---

## ✨ Overview

`plz-create-me` is a command-line tool that streamlines the process of bootstrapping new projects. It uses AI to generate shell commands, validate them, and execute them to set up your project structure based on your inputs.

Built on top of [Bun](https://bun.sh/), this tool combines modern CLI utilities, smart defaults, and AI-assisted logic to help you kickstart new projects effortlessly.

---

## 🚀 Features

- 🔮 **AI-assisted project setup** powered by [Deepseek](https://deepseek.com) or [OpenAI](https://openai.com)
- 🧱 Framework-aware shell script generation
- ✅ Safe command execution with syntax and existence checks
- ⚙️ Customizable prompts and options
- 🗂️ Clean and extensible file structure

---

## 📦 Requirements

- **Node.js** v20.0.0 or higher _(if using Node CLI)_
- **[Bun](https://bun.sh/)** runtime _(preferred for best performance)_
- A valid API key for `DEEPSEEK_API_KEY`

---

## 🧪 Installation

Install the package globally:

```bash
bun install -g plz-create-me

```

Or use it with npx (if installed locally):

```bash
npx plz-create-me
```

---

## 🧠 How It Works

1. You provide project details via CLI prompts.
1. The AI provider generates a shell script based on your selected framework.
1. The script is validated for safety:
   - Syntax is checked.
   - Each command is verified for availability.
1. The shell commands are executed, initializing your project structure.

---

## 🧰 CLI Usage

Start the interactive CLI:

```bash
plz-create-me
```

You will be prompted to select:

    - Project name
    - Framework
    - Target directory
    - Package manager
    - Additional tooling

Once confirmed, the tool will scaffold the project using validated shell commands.

---

## ⚙️ Configuration

Add your Deepseek API key to the environment variables :

```bash
export DEEPSEEK_API_KEY="YOUR_API_KEY"
```

---

## 📜 License

MIT

---

## 🙌 Credits

Created with ❤️ by [Sahrul Ramdan](https://github.com/nyxsr).

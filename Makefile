.PHONY: dev build preview format lint clean setup

# Desenvolvimento
dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

# Qualidade
format:
	npx prettier --write "src/**/*.{astro,ts,js,css,json}" "public/**/*.{yml,yaml}"

lint:
	npx astro check

# Setup
setup:
	npm install
	cp -n .env.example .env 2>/dev/null || true

clean:
	rm -rf dist .astro node_modules

# Sandbox
jail-setup:
	ai-jail --clean --init

jail-openclaude:
	ai-jail openclaude

jail-test:
	ai-jail bash

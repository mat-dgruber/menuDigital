.PHONY: dev build preview lint typecheck test clean

## dev – sobe o servidor local (HMR)
dev:
	npm run dev

## build – gera o output estático em dist/
build:
	npm run build

## preview – pré-visualiza o build local
preview:
	npm run preview

## lint – roda o eslint
lint:
	npm run lint

## typecheck – verificação de tipos do astro
typecheck:
	npx astro check

## test – roda os testes com vitest
test:
	vitest run

## clean – limpa cache e dist
clean:
	rm -rf .astro dist

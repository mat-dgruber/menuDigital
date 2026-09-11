import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const menu = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/menu" }),
  schema: z.object({
    nome: z.string(),
    descricao: z.string().optional(),
    preco: z.number(),
    categoria: z.string(),
    foto: z.string().optional(),
    destaque: z.boolean().default(false),
    maisPedido: z.boolean().default(false),
    disponivel: z.boolean().default(true),
    ordem: z.number().default(0),
    ingredientes: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { menu };

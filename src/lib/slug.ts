import type { PrismaClient } from "@prisma/client";

/**
 * Convert any string into a URL-safe kebab-case slug.
 * "My Cool Project v2!" → "my-cool-project-v2"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Generate a unique slug for a project name.
 * Checks the database and appends -1, -2, ... until the slug is available.
 * Pass `excludeId` when editing an existing project so it ignores its own current slug.
 */
export async function uniqueSlug(
  prisma: PrismaClient,
  name: string,
  excludeId?: number
): Promise<string> {
  const base = slugify(name);
  let candidate = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.project.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    candidate = `${base}-${counter}`;
    counter++;
  }
}

/**
 * Generic unique slug generator for any model.
 * Pass a finder function that looks up a slug and returns { id } or null.
 */
export async function uniqueSlugForModel(
  findBySlug: (slug: string) => Promise<{ id: number } | null>,
  name: string,
  excludeId?: number
): Promise<string> {
  const base = slugify(name);
  let candidate = base;
  let counter = 1;

  while (true) {
    const existing = await findBySlug(candidate);

    if (!existing || existing.id === excludeId) {
      return candidate;
    }

    candidate = `${base}-${counter}`;
    counter++;
  }
}

import path from 'path';
import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { logInfo } from '@/helpers';

const API_NAME = {
  GET: 'API GET CATEGORIES',
  POST: 'API POST CATEGORIES',
};

async function getCategories() {
  const jsonDirectory = path.join(process.cwd(), process.env.PATH_TO_JSON_FILE + '/categories/');
  const categories = await fs.readFile(jsonDirectory + 'categories.json', 'utf8');
  return categories;
}

async function addCategory(categories: { id: number; category: string }[]) {
  await fs.writeFile(
    process.cwd() + process.env.PATH_TO_JSON_FILE + '/categories/categories.json',
    JSON.stringify(categories),
  );
}

export async function GET() {
  try {
    const categoriesData = await getCategories();
    const categories = JSON.parse(categoriesData);

    logInfo(API_NAME.GET + ' : SUCCESS');
    return NextResponse.json({ categories }, { status: 200 });
  } catch (err) {
    logInfo(API_NAME.GET + ' : ERROR');
    return NextResponse.json({ error: JSON.stringify(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { category } = await request.json();
    if (!category) {
      logInfo(API_NAME.POST + ' : Category in request not found');
      throw new Error('Category in request not found');
    }
    const categoriesData = await getCategories();
    const categories = JSON.parse(categoriesData);
    categories.push({ id: categories.length + 1, category });
    await addCategory(categories);

    logInfo(API_NAME.POST + ' : SUCCESS');
    return NextResponse.json({ category }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    logInfo(API_NAME.POST + ' : ERROR!');
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import { logInfo } from '@/helpers';
import { ExpenseSchema } from '@/schemas';
import { IExpense } from '@/types';

const API_NAME = {
  GET: 'API GET EXPENSES',
  POST: 'API POST EXPENSES',
};

async function getExpenseJSON() {
  const jsonDirectory = path.join(process.cwd(), process.env.PATH_TO_JSON_FILE + '/expense/');
  const categories = await fs.readFile(jsonDirectory + 'expense.json', 'utf8');
  return categories;
}

async function addExpense(expenses: IExpense[]) {
  await fs.writeFile(
    process.cwd() + process.env.PATH_TO_JSON_FILE + '/expense/expense.json',
    JSON.stringify(expenses),
  );
}

export async function GET() {
  try {
    const expenseData = await getExpenseJSON();
    const expensesList = JSON.parse(expenseData);

    logInfo(API_NAME.GET + ' : SUCCESS');
    return NextResponse.json({ expenses: expensesList }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    logInfo(API_NAME.GET + ` : ERROR ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body) {
      throw new Error('Body is empty');
    }

    const validatedBody = await ExpenseSchema.safeParseAsync(body);
    if (!validatedBody.success) {
      const errors = validatedBody.error.flatten().fieldErrors;
      logInfo(API_NAME.POST + ' : Validate of Expense is not success');
      return NextResponse.json(errors, { status: 500 });
    }

    const { expense, category, date, comments } = validatedBody.data;
    const expenseData = await getExpenseJSON();
    const expensesList: IExpense[] = JSON.parse(expenseData);
    const id = crypto.randomUUID();
    const month = new Date(date).getUTCMonth();
    const year = new Date(date).getUTCFullYear();

    const newExpense = {
      id,
      expense,
      category,
      date,
      month,
      year,
      comments: comments ?? null,
    };
    expensesList.push(newExpense);
    await addExpense(expensesList);

    logInfo(API_NAME.POST + ' : SUCCESS');
    return NextResponse.json({ newExpense, success: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    logInfo(API_NAME.POST + ` : ERROR ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

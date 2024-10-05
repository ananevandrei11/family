'use server';
import z from 'zod';

const expenseSchema = z.object({
  expense: z.number().min(1),
  category: z.string(),
  date: z.date(),
  comments: z.string().optional(),
});

export async function sentExpense(formData: FormData) {
  try {
    const payload = {
      expense: Number(formData.get('expense')),
      category: formData.get('category'),
      date: new Date(formData.get('date') as string),
      comments: formData.get('comments'),
    };

    const validatedFields = await expenseSchema.safeParseAsync(payload);
    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const response = await fetch('http://localhost:4322/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...validatedFields.data,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        errors: await response.text(),
      };
    }

    await fetch('http://localhost:4322/api/expenses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });

    return {
      success: true,
      errors: null,
    };
  } catch (err) {
    return {
      success: false,
      errors: JSON.stringify(err),
    };
  }
}

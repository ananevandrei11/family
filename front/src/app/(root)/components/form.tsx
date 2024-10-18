'use client';

import { FormEvent, useRef, useState } from 'react';
import { sentExpense } from '../../actions';

function getDateValues() {
  const currentDate = new Date();
  const dateSevenDaysAgo = new Date();
  dateSevenDaysAgo.setDate(currentDate.getDate() - 7);

  const defaultValue = currentDate.toISOString().split('T')[0];
  const minValue = dateSevenDaysAgo.toISOString().split('T')[0];

  return {
    defaultValue,
    minValue,
  };
}

const CATEGORY = {
  products: 'Products',
  rent: 'Rent',
  sport: 'Sport',
  health: 'Health',
  technic: 'Technic',
  others: 'Others',
  cafe: 'Cafe',
};
const CATEGORY_OPTIONS = Object.entries(CATEGORY);

export default function Form() {
  const { defaultValue, minValue } = getDateValues();
  const [submitting, setSubmitting] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await sentExpense(formData);
      form.current?.reset();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>MAIN PAGE</h1>
      <form ref={form} onSubmit={handleSubmit}>
        <fieldset disabled={submitting}>
          <div>
            <label htmlFor="expense">The Expense</label>
            <input type="number" required inputMode="numeric" min="1" name="expense" id="expense" />
          </div>
          <div>
            <label htmlFor="date">Date of the expense</label>
            <input
              type="date"
              required
              name="date"
              id="date"
              defaultValue={defaultValue}
              min={minValue}
              max={defaultValue}
            />
          </div>
          <div>
            <label htmlFor="date">Date of the expense</label>
            <select name="category" id="category" required defaultValue={''}>
              <option value="" disabled>
                Choice the category
              </option>
              {CATEGORY_OPTIONS.map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="comments">The Comments</label>
            <textarea name="comments" id="comments" rows={4} cols={50}></textarea>
          </div>
          <button type="submit">Submit</button>
        </fieldset>
      </form>
    </div>
  );
}

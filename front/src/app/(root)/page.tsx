async function getCategories() {
  const data = await fetch(process.env.NEXT_PUBLIC_URL + '/api/categories', {
    method: 'GET',
  });
  const categories = await data.json();
  return categories;
}

export default async function Home() {
  const data = await getCategories();
  const categories = data.categories;
  console.log(data.categories);
  return (
    <div>
      <h1>MAIN PAGE</h1>
      <div>
        {(Array.isArray(categories) ? categories : [])?.map(
          (item: { id: number; category: string }) => (
            <div key={item.id}>
              <p>{item.category}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

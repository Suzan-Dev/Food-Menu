const formEl = document.getElementById('form-js'),
  search = document.getElementById('search-js'),
  random = document.getElementById('random-js'),
  resultHeading = document.getElementById('result-heading-js'),
  mealEl = document.getElementById('meals-js'),
  singleMeal = document.getElementById('single-meal-js');

// Search for meal and fetch 3rd party API
function searchMeal(e) {
  e.preventDefault();

  const input = search.value;
  if (input.trim()) {
    // !(input.trim() === '') same as above condition
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);

        if (data.meals) {
          resultHeading.innerHTML = `<h2>Search results for '${input}'</h2>`;
          mealEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-name" data-mealID="${meal.idMeal}">
                <h5>${meal.strMeal}</h5>
              </div>
            </div>
          `
            )
            .join('');
          singleMeal.innerHTML = '';
        } else {
          resultHeading.innerHTML = `<h2>There are no search results. Try another food!</h2>`;
          mealEl.innerHTML = '';
          singleMeal.innerHTML = '';
        }

        // search.textContent/innerText = ''-> wrong as search is a input
        search.value = '';
      });
  } else {
    alert('Please enter something!');
  }
}

function getMealByID(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

function addMealToDOM(meal) {
  // console.log(meal);
  const ingredientsArr = [];

  for (let i = 1; i <= 20; i++) {
    // using another object property accessing syntax here
    if (meal[`strIngredient${i}`]) {
      ingredientsArr.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  // console.log(ingredientsArr);

  singleMeal.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredientsArr.map((ing) => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function randomMeal() {
  // Clearing if theres anything in screen
  resultHeading.innerHTML = '';
  mealEl.innerHTML = '';
  singleMeal.innerHTML = '';

  // Fetching random Meal from API
  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}

// Add Event Listeners
formEl.addEventListener('submit', searchMeal);
random.addEventListener('click', randomMeal);

mealEl.addEventListener('click', (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-name');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
    getMealByID(mealID);
  }
});

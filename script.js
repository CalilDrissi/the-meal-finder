const c = console.log;

// Get elements from dom
const input = document.querySelector("input");
const form = document.querySelector("form");
const meals = document.querySelector(".output");
const random = document.querySelector(".random");
const popup = document.querySelector(".popup");






// callbacks

function searchMeal(e) {
  e.preventDefault();

  const term = input.value.trim();

  //check if empty:
  if (term) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals === null) {
          c("no match");
        } else {
          meals.innerHTML = data.meals
            .map(
              (meal) =>
                `<div class="card meal-info" data-mealid="${meal.idMeal}"> 
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                    <div class="card__heading" >
                        <h3>${meal.strMeal}<h3/>
                    </div>
                </div>
                `
            )
            .join("");
        }
      });
    input.value = "";
  } else {
    alert("Please enter search value or use random button");
  }
}


// Fetch single meal details
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
  .then((res) => res.json())
  .then(data => {
   const meal = data.meals[0];
   addMealToDom(meal);
  })
}



// Add meal to dom
function addMealToDom(meal) {
  const ingredients = [];
  for(let i =1; i <= 20; i++) {
    if(meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }
  popup.classList.add('active');
  popup.innerHTML = `
    <div> 
      <h1> ${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `
}


const getRandomMeal = () => {
  // Clear meals and heading
  meals.innerHTML = '';
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDom(meal);
    });
}

// event listeners;

form.addEventListener("submit", searchMeal);

random.addEventListener("click", getRandomMeal);

meals.addEventListener('click', e =>{

  const mealInfo = e.composedPath().find(item => {
   
    if (item.classList) {
      return item.classList.contains('meal-info');
    }else{
      return false
    }
  });

  if(mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid');
   getMealById(mealID);
  }
  
});


popup.addEventListener("dblclick",function(){
  document.querySelector('.popup').classList.remove("active");
});
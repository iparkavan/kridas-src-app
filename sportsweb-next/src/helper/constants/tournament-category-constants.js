export const getTournamentCategoryName = (tournamentCategory, sport) => {
  let tournamentCategoryName = tournamentCategory.tournamentCategoryName;
  if (!tournamentCategoryName) {
    const categoryName = sport?.sports_category.find(
      (cat) => cat.category_code === tournamentCategory.tournamentCategory
    )?.category_name;

    const tournamentConfig = JSON.parse(tournamentCategory.tournamentConfig);

    tournamentCategoryName = `${sport?.sports_name} - ${categoryName} (${
      tournamentConfig.age_criteria?.criteria_by
    }${
      tournamentConfig.age_criteria?.age_value &&
      ` ${tournamentConfig.age_criteria.age_value}`
    })`;
  }
  return tournamentCategoryName;
};

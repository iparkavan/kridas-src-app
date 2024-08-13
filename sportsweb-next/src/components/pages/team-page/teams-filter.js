import { useEffect, useState } from "react";
import { ButtonGroup, ModalFooter, Select, SimpleGrid } from "@chakra-ui/react";
import Button from "../../ui/button";
import Modal from "../../ui/modal";
import { useSports } from "../../../hooks/sports-hooks";
import { useLookupTable } from "../../../hooks/lookup-table-hooks";
import { useCategoriesByType } from "../../../hooks/category-hooks";

function TeamsFilter(props) {
  const { isOpen, onClose, pageData, filters, setFilters } = props;
  const [localFilters, setLocalFilters] = useState(filters);

  const { data: sportsData = [] } = useSports({
    select: (data) => {
      return data.filter((sport) =>
        pageData?.["sports_interested"]?.includes(sport["sports_id"])
      );
    },
  });
  const { data: skillsData = [] } = useCategoriesByType("SKI");
  const { data: genderData = [] } = useLookupTable("GEN");

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const handleChange = (e) => {
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setFilters(localFilters);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filter Teams" size="2xl">
      <SimpleGrid columns={2} spacing={10}>
        <Select
          placeholder="Sports"
          name="sports_id"
          value={localFilters.sports_id}
          onChange={handleChange}
        >
          {sportsData?.map((sport) => (
            <option key={sport["sports_id"]} value={sport["sports_id"]}>
              {sport["sports_name"]}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Gender"
          name="gender"
          value={localFilters.gender}
          onChange={handleChange}
        >
          {genderData?.map((gender) => (
            <option key={gender["lookup_key"]} value={gender["lookup_key"]}>
              {gender["lookup_value"]}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Age Group"
          name="age_group"
          value={localFilters.age_group}
          onChange={handleChange}
        >
          {localFilters.sports_id &&
            sportsData
              .find((s) => s["sports_id"] == localFilters["sports_id"])
              ?.["sports_age_group"]?.map((ageGroup) => (
                <option
                  key={ageGroup["age_group_code"]}
                  value={ageGroup["age_group_code"]}
                >
                  {ageGroup["age_group"]}
                </option>
              ))}
        </Select>
        <Select
          placeholder="Skill Level"
          name="skill_level"
          value={localFilters.skill_level}
          onChange={handleChange}
        >
          {skillsData?.map((skill) => (
            <option key={skill["category_id"]} value={skill["category_id"]}>
              {skill["category_name"]}
            </option>
          ))}
        </Select>
      </SimpleGrid>
      <ModalFooter p={0} mt={5}>
        <ButtonGroup spacing={3}>
          <Button onClick={handleFilter}>Apply Filters</Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
}

export default TeamsFilter;

import { ComboboxOptions } from "@/components/ui/combobox";
import { Dispatch, SetStateAction, useState } from "react";

type useMultipleCombobox = {
  selectedOptions: ComboboxOptions[];
  handleChange: (id: string) => void;
  setComboboxOptions: Dispatch<SetStateAction<ComboboxOptions[]>>;
  comboboxOptions: ComboboxOptions[];
};

const useMultipleCombobox = (): useMultipleCombobox => {
  const [selectedOptions, setSelectedOptions] = useState<ComboboxOptions[]>([]);
  const [comboboxOptions, setComboboxOptions] = useState<ComboboxOptions[]>([]);

  function handleChange(id: string) {
    const isOptionAlreadyAdded = selectedOptions.find(
      (option) => option.value === id
    );

    if (isOptionAlreadyAdded) {
      handleRemove(id);
    } else {
      const studentToAdd = comboboxOptions.find(
        (opt: ComboboxOptions) => opt.value === id
      );
      const updatedSelectedStudents = [...selectedOptions, studentToAdd];
      // @ts-ignore
      setSelectedOptions(updatedSelectedStudents);
    }
  }

  function handleRemove(studentId: string) {
    const filteredVal = selectedOptions?.filter(
      (opt) => opt.value !== studentId
    );

    setSelectedOptions(filteredVal);
  }

  return {
    selectedOptions,
    setComboboxOptions,
    comboboxOptions,
    handleChange,
  };
};

export default useMultipleCombobox;

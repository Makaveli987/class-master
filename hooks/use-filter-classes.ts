import { SchoolClassResponse } from "@/actions/get-classes";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface UseFilteredClasses {
  startDate: Date | null;
  endDate: Date | null;
  classroomId: string | null;
  teacherId: string | null;
  loading: boolean;
  filteredClasses: SchoolClassResponse[];
  updateClassroomId: Dispatch<SetStateAction<string | null>>;
  updateTeacherId: Dispatch<SetStateAction<string | null>>;
  updateDateRange: (newStartDate: Date | null, newEndDate: Date | null) => void;
  fetchClasses: () => Promise<void>;
}

const useFilteredClasses = (): UseFilteredClasses => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredClasses, setFilteredClasses] = useState<SchoolClassResponse[]>(
    []
  );

  const fetchClasses = async (): Promise<void> => {
    try {
      // Make your API request or fetch data using the current parameters
      setLoading(true);

      const teacherIdParam = teacherId === "all" ? null : teacherId;
      const classroomIdParam = classroomId === "all" ? null : classroomId;

      const response = await axios.get("/api/classes", {
        params: {
          startDate,
          endDate,
          teacherId: teacherIdParam,
          classroomId: classroomIdParam,
        },
      });

      // Update the state with the filtered classes
      setFilteredClasses(response.data || []);
    } catch (error) {
      console.error("Error fetching filtered classes: ", error);
    } finally {
      console.log("loading 2", loading);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [startDate, endDate, classroomId, teacherId]);

  const updateClassroomId: Dispatch<SetStateAction<string | null>> = (
    newClassroomId
  ) => setClassroomId(newClassroomId);

  const updateTeacherId: Dispatch<SetStateAction<string | null>> = (
    newTeacherId
  ) => setTeacherId(newTeacherId);

  const updateDateRange = (
    newStartDate: Date | null,
    newEndDate: Date | null
  ) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return {
    startDate,
    endDate,
    classroomId,
    teacherId,
    filteredClasses,
    updateDateRange,
    updateClassroomId,
    updateTeacherId,
    fetchClasses,
    loading,
  };
};

export default useFilteredClasses;

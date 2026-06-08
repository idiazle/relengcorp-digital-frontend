import axios from "axios";

export const getConditionsData = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/summary-conditions`
    );
    return response;
  }
  catch (error) {
    console.error("Error fetching conditions data:", error);
    throw error;
  }
}

export const getEquipmentConditionByMonth = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/equipments/conditions-by-month`
    );
    return response;
  }
  catch (error) {
    console.error("Error fetching equipment condition by month:", error);
    throw error;
  }
}
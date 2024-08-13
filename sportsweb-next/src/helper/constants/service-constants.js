import clone from "just-clone";

export const convertToCTFormat = (serviceWeeklySchedules) => {
  let updatedWeeklySchedules = [];
  serviceWeeklySchedules.forEach((schedule) => {
    const weeklyScheduleDetails = schedule.slots.map((slot) => {
      const [startTime, endTime] = slot.value.split("-");
      return {
        startTime,
        endTime,
        isActive: true,
        recordStatus: "INSERT",
      };
    });
    schedule.days.forEach((day) => {
      const scheduleObj = {
        weekDay: day.value,
        isActive: true,
        weeklyScheduleDetails,
      };
      updatedWeeklySchedules.push(scheduleObj);
    });
  });
  return updatedWeeklySchedules;
};

export const processEditCTService = (
  originalServiceWeeklySchedules,
  newServiceWeeklySchedules
) => {
  const originalWeeklySchedules = clone(originalServiceWeeklySchedules);
  const newWeeklySchedules = clone(newServiceWeeklySchedules);

  newWeeklySchedules.forEach((schedule) => {
    const existingDay = originalWeeklySchedules.find(
      (s) => s.weekDay === schedule.weekDay
    );
    if (existingDay) {
      schedule.weeklyScheduleDetails.forEach((scheduleDetail) => {
        const existingSlot = existingDay.weeklyScheduleDetails.find(
          (wsd) =>
            wsd.startTime === scheduleDetail.startTime &&
            wsd.endTime === scheduleDetail.endTime
        );
        if (existingSlot) {
          existingSlot.recordStatus = "UPDATE";
        } else {
          existingDay.weeklyScheduleDetails.push(scheduleDetail);
        }
      });
    } else {
      originalWeeklySchedules.push(schedule);
    }
  });

  originalWeeklySchedules.forEach((schedule) => {
    schedule.weeklyScheduleDetails.forEach((scheduleDetail) => {
      if (scheduleDetail.recordStatus === null) {
        scheduleDetail.recordStatus = "DELETE";
      }
    });
  });

  return originalWeeklySchedules;
};

import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import Table from "../../components/UI/Table";
import TableActions from "../../components/UI/Table/TableActions";
import {
  deleteAppointment,
  updateAppointment,
} from "../../services/requests/appointments";
import { UNEXPECTED_ERROR_MSG } from "../../utils/contants";
import ConfirmAlert from "../../components/UI/ConfirmAlert";
import { Creators as PatientsActions } from "../../store/ducks/patients/reducer";
import { Creators as AppointmentsActions } from "../../store/ducks/appointments/reducer";
import Schedule from "../../components/UI/Schedule";

dayjs.extend(utc);

const ConfirmedScheduleList = ({ records, patientsTableId, setEditMode }) => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments);
  const { patients } = useSelector((state) => state.patients);

  const handleDelete = useCallback(
    async (record) => {
      ConfirmAlert({
        hasLoading: true,
        text: "This appointment will be permanently deleted.",
        confirmButtonText: "Yes, delete appointment",
        cancelButtonText: "No, keep this appointment",
        onConfirm: async () => {
          try {
            const { success } = await deleteAppointment(record.id);

            if (success) {
              const patId =
                record?.Patient?.id.toString() || record?.PatientId.toString();

              if (appointments) {
                dispatch(
                  AppointmentsActions.setAppointments(
                    [...appointments].filter(
                      (appnt) => appnt.id?.toString() !== record.id?.toString()
                    )
                  )
                );
              }

              if (patients) {
                dispatch(
                  PatientsActions.setPatients(
                    [...patients].map((patient) => {
                      if (patient.id.toString() === patId) {
                        return {
                          ...patient,
                          Appointments: [...patient.Appointments].filter(
                            (appnt) =>
                              appnt.id.toString() !== record.id.toString()
                          ),
                        };
                      }

                      return patient;
                    })
                  )
                );
              }

              if (setEditMode) setEditMode(null);
              if (Swal.isVisible()) Swal.close();
            } else throw new Error();
          } catch (error) {
            if (Swal.isVisible()) Swal.close();
            Swal.fire("Unexpected error", UNEXPECTED_ERROR_MSG, "error");
          }
        },
      });
    },
    [appointments, dispatch, patients, setEditMode]
  );

  const handleConfirm = useCallback(
    async (record) => {
      ConfirmAlert({
        hasLoading: true,
        text: "Once confirmed you'll no longer be able to edit or delete this appointment.",
        confirmButtonText: "Confirm Appointment",
        cancelButtonText: "Cancel",
        onConfirm: async () => {
          try {
            const date = dayjs.utc(record?.datetime?.split("T")?.[0]);
            const time = new Date(record?.datetime)
              .toLocaleTimeString()
              .split("")
              .slice(0, 5)
              .join("");
            const payload = {
              datetime: `${date.format("YYYY-MM-DD")} ${time}:00`,
              isConfirmed: true,
              InsuranceId: record.InsuranceId,
              PatientId: record?.PatientId,
            };
            const response = await updateAppointment(record.id, payload);

            if (response.success) {
              if (patients) {
                dispatch(
                  PatientsActions.setPatients(
                    [...patients].map((pat) => {
                      if (
                        pat.id?.toString() === record?.PatientId?.toString()
                      ) {
                        return {
                          ...pat,
                          Appointments: [...pat?.Appointments].map((appt) => {
                            if (appt.id?.toString() === record.id?.toString()) {
                              return {
                                ...record,
                                isConfirmed: true,
                              };
                            }

                            return appt;
                          }),
                        };
                      }

                      return pat;
                    })
                  )
                );
              }

              if (appointments) {
                dispatch(
                  AppointmentsActions.setAppointments(
                    [...appointments].map((appnt) => {
                      if (appnt.id?.toString() === record.id?.toString()) {
                        return { ...record, isConfirmed: true };
                      }

                      return appnt;
                    })
                  )
                );
              }

              if (Swal.isVisible()) Swal.close();
            } else throw new Error();
          } catch (error) {
            if (Swal.isVisible()) Swal.close();
            Swal.fire("Unexpected error", UNEXPECTED_ERROR_MSG, "error");
          }
        },
      });
    },
    [appointments, dispatch, patients]
  );

  const formatTableData = useCallback(
    (list, completeDate = true) =>
      list.map((record) => ({
        keyRecord: record.id,
        patientName: record?.Patient?.name || "Not Provided",
        datetime: record.datetime
          ? completeDate
            ? new Date(record.datetime).toLocaleString()
            : new Date(record.datetime).toLocaleTimeString()
          : // ? dayjs(record.datetime).format('DD/MM/YYYY HH:MM:ss')
            "Not Provided",
        pureDatetime: record?.datetime,
        insurance: record?.Insurance?.name || "None",
        status: record.isConfirmed ? "Confirmed" : "Pending",
        actions: !record.isConfirmed ? (
          <TableActions
            check={{
              visible: !record.isConfirmed,
              title: "Click to confirm this appointment",
              onClick: () => handleConfirm(record),
            }}
            del={{
              visible: !record.isConfirmed,
              title: "Click to delete this appointment",
              onClick: () => handleDelete(record),
            }}
          />
        ) : (
          <TableActions
            del={{
              visible: true,
              title: "Click to delete this appointment",
              onClick: () => handleDelete(record),
            }}
          />
        ),
      })),
    [handleConfirm, handleDelete]
  );

  if (!records || (!patientsTableId && !appointments)) return null;

  const columns = [
    {
      name: "Datetime",
      value: "datetime",
      id: 1,
      sort: true,
      sortField: "pureDatetime",
      sortType: "date",
    },
  ];

  if (!patientsTableId) {
    columns.push({ name: "Patient", value: "patientName", id: 4, sort: true });
  }

  columns.push({ name: "Insurance", value: "insurance", id: 2, sort: true });
  columns.push({ name: "Status", value: "status", id: 3, sort: true });
  columns.push({ name: "Actions", value: "actions", id: 5, sort: false });

  const getMessage = () => {
    if (patientsTableId) {
      return records.length
        ? "Here are all patient's appointments."
        : "This patient does not have appointments yet.";
    }

    return records?.length
      ? "Here are all your appointments. Please select or enter a date to filter them."
      : "You do not have appointments yet.";
  };

  return (
    <>
      <Table
        columns={columns}
        tableData={formatTableData(records).sort((a, b) => a - b)}
        tableId={patientsTableId || "schedule-table"}
        tableInfo={{
          visible: true,
          // showDateInfo: !patientsTableId,
          hasSearch: {
            type: patientsTableId ? "text" : "date",
          },
          title: "Appointments",
          message: getMessage(),
        }}
      />
    </>
  );
};

export default ConfirmedScheduleList;

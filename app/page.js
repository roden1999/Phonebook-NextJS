"use client";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import toast from 'react-hot-toast';

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [id, setId] = useState('');
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!loaded) {
      fetch("/api/contacts/")
        .then((res) => res.json())
        .then((resData) => {
          setData(resData);
          setFilteredContacts(resData); // initialize table data
        })
        .catch((err) => console.error(err));

      setLoaded(true);
    }
  }, [loaded]);

  useEffect(() => {
    if (!selectedContacts || selectedContacts.length === 0) {
      setFilteredContacts(data);
    } else {
      const selectedIds = selectedContacts.map((x) => x.id);
      const filtered = data.filter((x) => selectedIds.includes(x.id));
      setFilteredContacts(filtered);
    }
  }, [selectedContacts, data]);

  const contactItemTemplate = (option) => (
    <div>{option.first_name + " " + option.middle_name + " " + option.last_name}</div>
  );

  const selectedItemTemplate = (option) =>
    option ? `${option.first_name} ${option.last_name}` : "";

  const handleEdit = (e) => {
    console.log("Edit:", e);
    setEditModal(true);
    setId(e.id);
    setFirstName(e.first_name);
    setMiddleName(e.middle_name);
    setLastName(e.last_name);
    setPhonenumber(e.phone_number);
    setAddress(e.address);
  };

  const handleDelete = (id) => {
    console.log("Delete:", id);
    setDeleteModal(true);
    setId(id)
  };

  const handleAddContact = async () => {
    setLoader(true);
    try {
      const res = await fetch('/api/contacts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          phone_number: phonenumber,
          address: address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'adding failed');
        setLoader(false);
        return;
      }

      setShowModal(false);
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setPhonenumber("");
      setAddress("");

      toast.success('Contact added successfully!');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoader(false);
      setLoaded(false);
    }
  };

  const handlEditContact = async () => {
    setLoader(true);
    try {
      const res = await fetch('/api/contacts/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          phone_number: phonenumber,
          address: address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'updating failed');
        setLoader(false);
        return;
      }

      setEditModal(false);
      setId('');
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setPhonenumber("");
      setAddress("");

      toast.success('Contact updated successfully!');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoader(false);
      setLoaded(false);
    }
  };

  const handlDeleteContact = async () => {
    setLoader(true);
    try {
      const res = await fetch('/api/contacts/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'updating failed');
        setLoader(false);
        return;
      }

      setDeleteModal(false);
      setId('');

      toast.success('Contact deleted successfully!');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoader(false);
      setLoaded(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setPhonenumber("");
    setAddress("");
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setPhonenumber("");
    setAddress("");
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
    setId('');
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "3rem",
        background: "var(--surface-ground)",
      }}
    >
      <Card style={{ width: "70rem" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ margin: 0 }}>CONTACTS</h2>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <MultiSelect
              value={selectedContacts}
              options={data}
              onChange={(e) => setSelectedContacts(e.value)}
              itemTemplate={contactItemTemplate}
              selectedItemTemplate={selectedItemTemplate}
              filter
              filterBy="first_name,middle_name,last_name"
              placeholder="Search contact..."
              className="w-20rem"
              display="chip"
            />

            <Button
              label="Add"
              severity="primary"
              onClick={() => setShowModal(true)} // open modal
            />
          </div>
        </div>

        {/* TABLE */}
        <DataTable
          value={filteredContacts}
          paginator
          rows={10}
          emptyMessage="No contacts found"
          size="small"
          showGridlines
        >
          <Column field="first_name" header="First Name" />
          <Column field="middle_name" header="Middle Name" />
          <Column field="last_name" header="Last Name" />
          <Column field="phone_number" header="Phone Number" />
          <Column field="address" header="Address" />
          <Column
            header="Actions"
            body={(rowData) => (
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Button
                  label="Edit"
                  severity="secondary"
                  size="small"
                  onClick={() => handleEdit(rowData)}
                  className="p-button-outlined"
                />
                <Button
                  label="Delete"
                  severity="danger"
                  size="small"
                  onClick={() => handleDelete(rowData.id)}
                />
              </div>
            )}
            style={{ width: "8rem", textAlign: "center" }}
          />
        </DataTable>
      </Card>

      {/* add modal */}
      <Dialog
        header="Add Contact"
        visible={showModal}
        style={{ width: "30rem" }}
        modal
        onHide={handleCloseModal}
        breakpoints={{ "640px": "90vw" }}
        footer={
          <div className="p-d-flex p-jc-end p-gap-2">
            <Button
              label="Cancel"
              severity="secondary"
              onClick={handleCloseModal}
              className="p-button-outlined"
            />
            <Button
              label="Add"
              severity="primary"
              disabled={loader}
              onClick={handleAddContact}
            />
          </div>
        }
      >
        {error && (
          <div className="p-mb-3">
            <Message severity="error" text={error} />
          </div>
        )}

        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12">
            <label htmlFor="firstName">First Name</label>
            <InputText
              id="firstName"
              value={firstName}
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="middleName">Middle Name (Optional)</label>
            <InputText
              id="middleName"
              value={middleName}
              placeholder="Middle Name"
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="lastName">Last Name</label>
            <InputText
              id="lastName"
              value={lastName}
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="phoneNumber">Phone Number</label>
            <InputText
              id="phoneNumber"
              value={phonenumber}
              placeholder="Phone Number"
              onChange={(e) => setPhonenumber(e.target.value)}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="address">Address (Optional)</label>
            <InputText
              id="address"
              value={address}
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
      </Dialog>


      {/* edit modal */}
      <Dialog
        header="Edit Contact"
        visible={editModal}
        style={{ width: "30rem" }}
        modal
        onHide={handleCloseEditModal}
        breakpoints={{ "640px": "90vw" }}
        footer={
          <div className="p-d-flex p-jc-end p-gap-2">
            <Button
              label="Cancel"
              severity="secondary"
              onClick={handleCloseEditModal}
              className="p-button-outlined"
            />
            <Button
              label="Update"
              severity="primary"
              disabled={loader}
              onClick={handlEditContact}
            />
          </div>
        }
      >
        {error && (
          <div className="p-mb-3">
            <Message severity="error" text={error} />
          </div>
        )}

        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col-12">
            <label htmlFor="firstName">First Name</label>
            <InputText
              id="firstName"
              value={firstName}
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="middleName">Middle Name (Optional)</label>
            <InputText
              id="middleName"
              value={middleName}
              placeholder="Middle Name"
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="lastName">Last Name</label>
            <InputText
              id="lastName"
              value={lastName}
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="phoneNumber">Phone Number</label>
            <InputText
              id="phoneNumber"
              value={phonenumber}
              placeholder="Phone Number"
              onChange={(e) => setPhonenumber(e.target.value)}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="address">Address (Optional)</label>
            <InputText
              id="address"
              value={address}
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
      </Dialog>

      {/* delete modal*/}
      <Dialog header="Warning"
        visible={deleteModal}
        style={{ width: '50vw' }}
        onHide={deleteModal}
        footer={
          <div className="p-d-flex p-jc-end p-gap-2">
            <Button
              label="Cancel"
              severity="secondary"
              onClick={handleCloseDeleteModal}
              className="p-button-outlined"
            />
            <Button
              label="Delete"
              severity="primary"
              disabled={loader}
              onClick={handlDeleteContact}
            />
          </div>
        }
      >
        <p className="m-0">
          Areyou sure you want to delete this contact?
        </p>
      </Dialog>
    </div>
  );
}

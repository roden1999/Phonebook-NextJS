"use client";
import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { MultiSelect } from "primereact/multiselect";
import { Dialog } from "primereact/dialog";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { Toast } from 'primereact/toast';
import { Dock } from 'primereact/dock';
import { Rowdies } from "next/font/google";
// import toast from 'react-hot-toast';

// var apihost = "/api/routes/contacts/";
var apihost = "/api/routes/contacts_supabase/";

const CONTACT_INTERFACE = {
  first_name: "",
  middle_name: "",
  last_name: "",
  phone_number: "",
  address: ""
}

export default function Home() {
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [position, setPosition] = useState('right');

  const [showModal, setShowModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingRows, setEditingRows] = useState({});
  const delButton = useRef(null);

  const [contacts, setContacts] = useState(CONTACT_INTERFACE);

  useEffect(() => {
    if (!loaded) {
      fetch(apihost)
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
    setContacts(e);
    setEditingRows({ [e.id]: true });
  };

  const handleDelete = (e) => {
    console.log("Delete:", e);
    setDeleteModal(true);
    setContacts(e);
  };

  const handleAddContact = async () => {
    setLoader(true);
    console.log(contacts);
    try {
      const res = await fetch(apihost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contacts),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'adding failed');
        setLoader(false);
        return;
      }

      setShowModal(false);
      setContacts(CONTACT_INTERFACE);

      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Contact added successfully!' });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoader(false);
      setLoaded(false);
    }
  };

  const handlEditContact = async () => {
    setLoader(true);
    console.log(contacts);
    try {
      const res = await fetch(apihost, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contacts),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'updating failed');
        setLoader(false);
        return;
      }

      // setEditModal(false);
      setContacts(CONTACT_INTERFACE);
      setEditingRows({});

      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Contact updated successfully!' });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoader(false);
      setLoaded(false);
    }
  };

  const handlDeleteContact = async () => {
    setLoader(true);
    console.log(contacts.id);
    try {
      const res = await fetch(apihost, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: contacts.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'updating failed');
        setLoader(false);
        return;
      }

      setDeleteModal(false);
      setContacts(CONTACT_INTERFACE);

      toast.current.show({ severity: 'warn', summary: 'Success', detail: 'Contact deleted successfully!' });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoader(false);
      setLoaded(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setContacts(CONTACT_INTERFACE);
  };

  const handleCloseEditModal = () => {
    setEditModal(false);
    setContacts(CONTACT_INTERFACE);
  };

  const handleCancelEdit = () => {
    setContacts(CONTACT_INTERFACE);
    setEditingRows({});
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
    setContacts(CONTACT_INTERFACE);
  }

  const handleInputChange = (e, prop) => {
    contacts[prop] = e.target.value;
    setContacts(contacts);
  }

  // Actions column
  const actionBodyTemplate = (rowData) => {
    const isEditing = editingRows[rowData.id];

    return isEditing ? (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <Button
          icon="pi pi-times"
          rounded
          outlined
          className="mr-2"
          severity="secondary"
          onClick={handleCancelEdit} />

        <Button
          icon="pi pi-save"
          rounded
          className="mr-2"
          onClick={handlEditContact} />
      </div>
    ) : (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          severity="secondary"
          onClick={() => handleEdit(rowData)}
          disabled={Object.keys(editingRows).length > 0} />

        <Button
          ref={delButton}
          icon="pi pi-trash"
          rounded
          className="mr-2"
          severity="danger"
          onClick={() => handleDelete(rowData)}
          disabled={Object.keys(editingRows).length > 0} />
      </div>
    );
  };

  const dockItems = [
    {
      label: 'Portfolio',
      tooltip: "My Portfolio",
      icon: () => <img alt="portfolio" src="/icons/portfolio.svg" width="100%" />,
      command: () => window.open('https://roden-mark-montoya.onrender.com/', '_blank'),
    },
    {
      label: 'Projects',
      tooltip: "My Projects",
      icon: () => <img alt="projects" src="/icons/projects.svg" width="100%" />,
      command: () => window.open('https://github.com/roden1999?tab=repositories', '_blank'),
    },
    {
      label: 'Account',
      tooltip: '@roden1999',
      icon: () => <img alt="account" src="/icons/account.svg" width="100%" />,
      command: () => window.open('https://github.com/roden1999', '_blank'),
    },
    {
      label: 'About',
      tooltip: 'About',
      icon: () => <img alt="about" src="/icons/about.svg" width="100%" />,
      command: () => setAboutModal(true),
    }
  ];

  return (
    <div
      className="animated-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "3rem",
        backgroundColor: "#b0bec5", // darker base
        backgroundImage: `
      radial-gradient(circle 1px, rgba(0,0,0,0.15) 1px, transparent 1px),
      radial-gradient(circle 1px, rgba(0,0,0,0.15) 1px, transparent 1px)
    `,
        backgroundPosition: "0 0, 10px 10px",
        backgroundSize: "20px 20px",
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
          <Toast ref={toast} position="top-center" />
          <Dock model={dockItems} position={position} />

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
          dataKey="id"
          editMode="row"
          editingRows={editingRows}
          onRowEditChange={(e) => setEditingRows(e.data)}
          paginator
          rows={10}
          showGridlines
          size="small"
          scrollable
          scrollHeight="400px"
        >
          <Column
            field="first_name"
            header="First Name"
            editor={() => (
              <InputText
                className="p-inputtext-sm"
                defaultValue={contacts.first_name}
                onChange={(e) => handleInputChange(e, "first_name")}
              />
            )}
          />
          <Column
            field="middle_name"
            header="Middle Name"
            editor={() => (
              <InputText
                className="p-inputtext-sm"
                defaultValue={contacts.middle_name}
                onChange={(e) => handleInputChange(e, "middle_name")}
              />
            )}
          />
          <Column
            field="last_name"
            header="Last Name"
            editor={() => (
              <InputText
                className="p-inputtext-sm"
                defaultValue={contacts.last_name}
                onChange={(e) => handleInputChange(e, "last_name")}
              />
            )}
          />
          <Column
            field="phone_number"
            header="Phone"
            editor={() => (
              <InputText
                className="p-inputtext-sm"
                defaultValue={contacts.phone_number}
                onChange={(e) => handleInputChange(e, "phone_number")}
              />
            )}
          />
          <Column
            field="address"
            header="Address"
            editor={() => (
              <InputText
                className="p-inputtext-sm"
                defaultValue={contacts.address}
                onChange={(e) => handleInputChange(e, "address")}
              />
            )}
          />
          <Column header="Actions" frozen body={actionBodyTemplate}
            style={{ width: "8rem", textAlign: "center", position: 'sticky', right: 0, background: 'var(--surface-card)', zIndex: 1, }}
            headerStyle={{
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              background: 'var(--surface-ground)', // match table header
              zIndex: 3, // header above body
            }}
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
              loading={loader}
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
              // value={firstName}
              placeholder="First Name"
              onChange={(e) => handleInputChange(e, "first_name")}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="middleName">Middle Name (Optional)</label>
            <InputText
              id="middleName"
              // value={middleName}
              placeholder="Middle Name"
              onChange={(e) => handleInputChange(e, "middle_name")}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="lastName">Last Name</label>
            <InputText
              id="lastName"
              //value={lastName}
              placeholder="Last Name"
              onChange={(e) => handleInputChange(e, "last_name")}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="phoneNumber">Phone Number</label>
            <InputText
              id="phoneNumber"
              //value={phonenumber}
              placeholder="Phone Number"
              onChange={(e) => handleInputChange(e, "phone_number")}
            />
          </div>

          <div className="p-field p-col-12">
            <label htmlFor="address">Address (Optional)</label>
            <InputText
              id="address"
              //value={address}
              placeholder="Address"
              onChange={(e) => handleInputChange(e, "address")}
            />
          </div>
        </div>
      </Dialog>

      {/* delete popup*/}
      <ConfirmPopup target={delButton.current} visible={deleteModal} onHide={handleCloseDeleteModal}
        message="Are you sure you want to delete this contact?"
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        rejectClassName="p-button-secondary p-button-outlined"
        accept={handlDeleteContact}
        reject={handleCloseDeleteModal} />

      <Dialog
        header="About This Project"
        visible={aboutModal}
        style={{ width: "50rem", maxWidth: "95vw", padding: "1rem" }}
        modal
        onHide={() => setAboutModal(false)}
        breakpoints={{ "640px": "90vw" }}
        draggable
        resizable
      >
        <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>

          <p style={{ fontSize: "1.1rem" }}>
            This <strong>Phonebook Project</strong> is a portfolio project designed to showcase my full-stack development skills.
            The goal was to build a modern, responsive, and clean contacts management app using <strong>Next.js</strong> for both frontend and backend.
            The project demonstrates my ability to integrate a modern frontend library with robust backend systems while practicing good coding patterns,
            such as single-state management and clean data handling via stored procedures.
            It’s a practical showcase of my skills for portfolio, client demos, or interviews.
          </p>

          <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>UI & Frontend</h3>
          <p>
            The user interface is built with <strong>React Prime</strong> components like <code>DataTable</code>, <code>Dialog</code>, and <code>Dock</code>.
            I used inline styles for quick customization and a polished look.
            Initially, I was managing many separate states for each field, like <code>first_name</code>, <code>last_name</code>, etc.
            My mentor pointed out that this is not a good practice.
            I refactored the code to use a single state for the entire contact object (fetching <code>data</code> instead of multiple small states),
            which simplified my state management and made the code cleaner and easier to maintain.
          </p>

          <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Backend & Database</h3>
          <p>
            The project uses <strong>Next.js API routes</strong> for server-side logic.
            For local testing, I use <strong>SQL Server</strong>, and for production-ready storage, I use <strong>Supabase PostgreSQL</strong>.
            I also practiced writing and integrating <strong>stored procedures</strong>, which allows me to handle CRUD operations efficiently and securely.
          </p>
          <p>
            Instead of sending multiple small data items from the frontend to the backend, I now send a single JSON object to the stored procedure.
            This approach makes the code cleaner, reduces redundancy, and aligns with best practices for modern web apps.
          </p>

          <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Tech Stack</h3>
          <ul>
            <li>Next.js 14 (App Router)</li>
            <li>React Prime Components</li>
            <li>SQL Server (local) & Supabase PostgreSQL (production)</li>
            <li>RESTful API Routes</li>
            <li>Responsive, Interactive, and Clean UI</li>
            <li>Stored Procedures for database operations</li>
          </ul>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
            <Button label="Close" severity="secondary" onClick={() => setAboutModal(false)} className="p-button-outlined" />
          </div>
        </div>
      </Dialog>
    </div>

  );
}

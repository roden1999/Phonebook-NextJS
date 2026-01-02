# Next.js Contacts App

[![Next.js](https://img.shields.io/badge/Next.js-13.5.5-blue?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Project Overview

This project is a **Next.js full-stack application** built as a **learning and practice platform**.  
Its main goal is to **train full-stack skills**, focusing on clean code practices from **UI → API → Database**.  

It is a **Contacts management system**, where users can **add, update, view, and soft-delete contacts**.  

Key learning objectives:

- Building **responsive, reusable UI components** in Next.js.
- Writing **clean API routes** with proper validation and error handling.
- Using **stored procedures / database functions** to handle inserts, updates, and deletes.
- Practicing **structured JSON handling in the database**.
- Implementing **soft delete** and maintaining data integrity.

---

## Features

- **Add Contact** – Insert new contacts via JSON input.
- **Update Contact** – Update existing contact information.
- **View Contacts** – Retrieve all non-deleted contacts with sorting.
- **Soft Delete** – Mark contacts as deleted without permanently removing data.
- **Reusable Components** – Clean, modular UI components.
- **Server-Side Validation** – Required fields are checked before DB interaction.

---

## Tech Stack

- **Frontend:** Next.js, React, TailwindCSS
- **Backend:** Next.js API routes
- **Database:** PostgreSQL (Supabase) or SQL Server
- **Database Layer:** Stored procedures / functions
- **State Management:** React Hooks / Local state
- **Tools:** Supabase JS, Node.js, Vercel for deployment

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- PostgreSQL (Supabase) or SQL Server instance
- Supabase account if using PostgreSQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/roden1999/Phonebook-NextJS.git
cd Phonebook-NextJS

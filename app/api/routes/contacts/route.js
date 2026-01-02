import { NextResponse } from "next/server";
import { getConnection } from "../../lib/db";

export async function GET() {
  var pool = await getConnection();
  // console.log(pool);
  var response = await pool.request().execute('[get_contacts]');
  return NextResponse.json(response.recordset, { status: 201 });
}

export async function POST(request) {
  const body = await request.json();
  console.log(body);
  if (!body.first_name?.trim() || !body.last_name?.trim() || !body.phone_number?.trim()) {
    throw new Error('Missing required fields');
  }

  const pool = await getConnection();
  try {
    await pool
      .request()
      .input('jsonData', JSON.stringify(body))
      .execute('[post_contact]');

    return NextResponse.json({ message: "Save Successfully", body }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function PUT(request) {
  const body = await request.json();
  console.log(body.id);
  if (!body.id?.trim() || !body.first_name?.trim() || !body.last_name?.trim() || !body.phone_number?.trim()) {
    throw new Error('Missing required fields');
  }

  const pool = await getConnection();
  try {
    await pool
      .request()
      .input('jsonData', JSON.stringify(body))
      // .input('id', body.id)
      // .input('first_name', body.first_name)
      // .input('middle_name', body.middle_name)
      // .input('last_name', body.last_name)
      // .input('phone_number', body.phone_number)
      // .input('address', body.address)
      .execute('[post_contact]');

    return NextResponse.json({ message: "Updated successfuly", body }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  const body = await request.json();
  console.log(body.id);
  if (!body.id) {
    throw new Error('Missing Id');
  }

  const pool = await getConnection();
  try {
    await pool
      .request()
      .input('id', body.id)
      .execute('[delete_contact]')
      // .query(`UPDATE Contacts
      //       SET
      //           is_deleted = 1
      //       WHERE id = @id
      //       AND is_deleted = 0;
      // `);

    return NextResponse.json({ message: "Deleted successfuly", body }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
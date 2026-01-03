import { supabase } from "../../lib/supabase";
import { NextResponse } from 'next/server';

export async function GET() {
    const { data, error } = await supabase.rpc('get_contacts')

    if (error) {
        console.error('Error fetching contacts:', error)
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
}

export async function POST(request) {
    const body = await request.json();

    if (!body.first_name?.trim() || !body.last_name?.trim() || !body.phone_number?.trim()) {
        throw new Error('Missing required fields');
    }

    try {
        console.log(JSON.stringify(body));
        const { error } = await supabase.rpc('post_contact', {
            json_data: body,
        });

        if (error) {
            console.log(error);
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

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

    try {
        const { error } = await supabase.rpc('post_contact', {
            json_data: body,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return NextResponse.json({ message: "Updated successfuly", body }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}

export async function DELETE(request) {
    const body = await request.json();
    console.log("Id:", body.id);
    if (!body.id) {
        throw new Error('Missing Id');
    }

    try {
        const { error } = await supabase.rpc('delete_contact', {
            id: body.id,
        });

        if (error) {
            console.log(error);
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return NextResponse.json({ message: "Deleted successfuly", body }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 400 });
    }
}

const updateEventHandler = args => {
    const requestBody = {
        query: `
            mutation UpdateEvent($id: ID!, $title: String!, $description: String!, $price: Int!, $date: String!, $bookingCount: Int!) {
                updateEvent(updateInput: {_id: $id, title: $title, description: $description, price: $price, date: $date, bookingCount: $bookingCount}) {
                    _id
                }
            }
        `,
        variables: {
            id: args._id,
            title: args.title,
            description: args.description,
            price: args.price,
            date: args.date,
            bookingCount: args.bookingCount
        }
    };

    fetch('http://localhost:8000/api', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + args.token
        }
    }).then(res => {
        if(res.status !== 200 && res.status !== 201) {
            throw new Error('Update Failed!');
        }
        return res.json();
    })
    .then(resData => {            
        console.log(resData);
    })
    .catch(err => {
        console.log(err);
    });
}

exports.updateEventHandler = updateEventHandler;
import "./style.css"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap"
import $ from 'jquery';

document.getElementById('get_all_btn').addEventListener('click', getAll)
document.getElementById('insert_person_btn').addEventListener('click', addPerson)
document.getElementById('delete_btn').addEventListener('click', deletePerson)



      // GET all
function getAll() {
  fetch('https://api.codergram.me/ca2/api/persons')
      .then(response => response.json())
      .then(data => {
          
          const allPersons = data.map(person => `
           <tr>
           <td>${person.id}</td> 
           <td>${person.firstName}</td> 
           <td>${person.lastName}</td> 
           <td>${person.email}</td> 
           <td>${person.phones.map( phone => `<p>${phone.number}</p>`)}</td> 
           <td>${person.address.street}</td> 
           <td>${person.address.cityInfo.city}</td>
           <td>${person.address.cityInfo.zipCode}</td>
           <td>${person.hobbies.map(hobby => `<p>${hobby.name}</p>`).join()}</td> 
           <td><button class="btn btn-danger" title="delete"  id="${person.id}">Delete</button></td>
           `)
          document.getElementById('tbody').innerHTML = '<ul>' + allPersons.join("") + '<ul>'
      })
      .catch(err => {
          if (err.status) {
              err.fullError.then(e => console.log(e.detail))
          } else {
              console.log("Network error");
          }
      });
      
}

document.getElementById("savebtn").addEventListener('click', function () {
    const email = document.getElementById("personEmail").value;
    const firstName = document.getElementById("personFirstName").value;
    const lastName = document.getElementById("personLastName").value;
    const street = document.getElementById("addressStreet").value;
    const zipCode = document.getElementById("addressZip").value;
    const city = document.getElementById("addressCity").value;
    const number = document.getElementById("personPhone").value;
    const name = document.getElementById("personHobby").value;

    const hobby = {
        "name": name,
        "description": ""
    }

    const hobbies = [
        hobby
    ]

    const phone = {
        "number": number
    }

    const phones = [
        phone
    ]

    const cityInfo = {
        "zipCode": zipCode,
        "city": city
    }

    const address = {
        "street": street,
        "additionalInfo": "",
        "cityInfo": cityInfo
    }

    const person = {
        "email": email,
        "firstName": firstName,
        "lastName": lastName,
        "address": address,
        "phones": phones,
        "hobbies": hobbies
    }

    console.log(person);
    console.log(JSON.stringify(person));

    addPerson(person)
        .then(persons => {
             console.log("test");
            // console.log(persons);
            // console.log(persons.all);

            //Reload persons array
            getAll();
            //Reset values
            resetValues();

        }).catch(err => {
        if (err.status) {
            err.fullError.then(e => {
                console.log(e.detail);
                console.log(e);
                //Print error message on website
                document.getElementById("error").innerHTML = "ERROR!!! Status code: " + e.status + ", message: " + e.msg;
                document.getElementById("error").style.display = "block";
            })
        } else {
            console.log("Network error");
            document.getElementById("error").innerHTML = "Network error";
            document.getElementById("error").style.display = "block";
        }
    });
});

function deletePerson(id){
    const option = makeOptions("DELETE", "");
    return fetch("https://api.codergram.me/ca2/api/person/" + id, option)
        .then(res => handleHttpErrors(res))
}

function getPersonById(id){
    return fetch("https://api.codergram.me/ca2/api/person/" + id)
        .then(res => handleHttpErrors(res))
}

function addPerson(person){
    const option = makeOptions("POST", person);
    return fetch("https://api.codergram.me/ca2/api/person/", option)
        .then(res => handleHttpErrors(res))
}


document.getElementById("tbody").addEventListener('click', function (event) {
    console.log(event);
    console.log(event.target);
    console.log(event.target.id);
    console.log(event.target.title);
    const id = event.target.id;
    const action = event.target.title;
    if (action === "delete") {
        deletePerson(id)
            .then(res => {
                //console.log("test");
                // console.log(res);

                //Reload person array
                getAll();

            }).catch(err => {
            if (err.status) {
                err.fullError.then(e => {
                    console.log(e.detail);
                    console.log(e);
                    //Print error message on website
                    document.getElementById("error").innerHTML = "ERROR!!! Status code: " + e.status + ", message: " + e.msg;
                    document.getElementById("error").style.display = "block";
                })
            } else {
                console.log("Network error");
                document.getElementById("error").innerHTML = "Network error";
                document.getElementById("error").style.display = "block";
            }
        });
    } else {
        getPersonById(id)
            .then(person => {
                // console.log("test");
                console.log(person);
                // console.log(persons.all);

                const listOfHobbies = person.hobbies.map(hobby => `${hobby.name}`).join("");
                const listOfPhone = person.phones.map(phone => parseInt(phone.number)).join();

                //Insert person data in to Modal
                document.getElementById("personID").value = person.id;
                document.getElementById("editPersonEmail").value = person.email;
                document.getElementById("editPersonFirstName").value = person.firstName;
                document.getElementById("editPersonLastName").value = person.lastName;
                document.getElementById("editAddressStreet").value = person.address.street;
                document.getElementById("editAddressZip").value = person.address.cityInfo.zipCode;
                document.getElementById("editAddressCity").value = person.address.cityInfo.city;
                //Giver fej da backend ikke tjekker om det er det samme nummer man sender, som person har
                //document.getElementById("editPersonPhone").value = listOfPhone;
                document.getElementById("editPersonHobby").value = listOfHobbies;

            }).catch(err => {
            if (err.status) {
                err.fullError.then(e => {
                    console.log(e.detail);
                    console.log(e);
                    //Print error message on website
                    document.getElementById("error").innerHTML = "ERROR!!! Status code: " + e.status + ", message: " + e.msg;
                    document.getElementById("error").style.display = "block";
                })
            } else {
                console.log("Network error");
                document.getElementById("error").innerHTML = "Network error";
                document.getElementById("error").style.display = "block";
            }
        });
    }
});




async function displayUI() {    
    await signIn();

    // Display info from user profile
    const user = await getUser();
    var userName = document.getElementById('userName');
    userName.innerText = user.displayName;
    var email = document.getElementById('email');
    email.innerText = user.mail;

    // Hide login button and initial UI
    var signInButton = document.getElementById('signin');
    signInButton.style = "display: none";
    var content = document.getElementById('content');
    content.style = "display: block";

    var showPhotoButton= document.getElementById('showProfilePhoto');
    showPhotoButton.style = "display: block";

    var showEventsButton = document.getElementById('btnShowEvents');
    showEventsButton.style = "display: block";

    displayFiles();
}

async function displayProfilePhoto() {
    const userPhoto = await getUserPhoto();
    if (!userPhoto) {
        return;
    }
  
    //convert blob to a local URL
    const urlObject = URL.createObjectURL(userPhoto);
    // show user photo
    const userPhotoElement = document.getElementById('userPhoto');
    userPhotoElement.src = urlObject;
    var showPhotoButton= document.getElementById('showProfilePhoto');
    showPhotoButton.style = "display: none";
    var imgPhoto= document.getElementById('userPhoto');
    imgPhoto.style = "display: block";
}

var nextLink;

async function displayEmail() {
    const userEmails = await getUserEmails(nextLink);
    if (!userEmails || userEmails.value.length < 1) {
        return;
    }
    nextLink = userEmails['@odata.nextLink'];
    
    document.getElementById('displayEmail').style = 'display: none';

    var userEmailsElement = document.getElementById('emails');
    userEmails.value.forEach(email => {
        var emailLi = document.createElement('li');
        emailLi.innerText = `${email.subject} (${new Date(email.receivedDateTime).toLocaleString()})`;
        userEmailsElement.appendChild(emailLi);
      });

    window.scrollTo({ top: userEmailsElement.scrollHeight, behavior: 'smooth' });

    if (nextLink) {
        document.getElementById('loadMoreContainer').style = 'display: block';
    } else {
        document.getElementById('loadMoreContainer').style = 'display: none';
    }
}

async function displayEvents() {
    const userEvents = await getUserCalendar();
    if (!userEvents || userEvents.value.length < 1) {
        var content = document.getElementById('content');
        var noItemsMessage = document.createElement('p');
        noItemsMessage.innerHTML = `No events for the coming week!`;
        content.appendChild(noItemsMessage)
    } else {
        document.getElementById('eventWrapper').style = 'display: block';

        var userEventsElement = document.getElementById('events');
        userEvents.value.forEach(event => {
            var eventLi = document.createElement('li');
            eventLi.innerText = `${event.subject} - From  ${new Date(event.start.dateTime).toLocaleString()} to ${new Date(event.end.dateTime).toLocaleString()} `;
            userEventsElement.appendChild(eventLi);
        });
    }
    document.getElementById('btnShowEvents').style = 'display: none';
}

async function displayFiles() {
    const userFiles = await getUserFiles();
    const userFilesElement = document.getElementById('files');
    while (userFilesElement.firstChild) {
        userFilesElement.removeChild(userFilesElement.firstChild);
    }
    for (let file of userFiles) {
        if (!file.folder && !file.package) {
          let a = document.createElement('a');
          a.href = '#';
          a.onclick = () => { downloadFile(file); };
          a.appendChild(document.createTextNode(file.name));
          let fileLi = document.createElement('li');
          fileLi.appendChild(a);
          userFilesElement.appendChild(fileLi);
        }
      }
}

function fileSelected(e) {
    displayUploadMessage(`Uploading ${e.files[0].name} ...`);
    uploadFile(e.files[0])
        .then((response) => {
            displayUploadMessage(`File ${response.name} of ${response.size} bytes uploaded`);
            displayFiles();
        });
}

function displayUploadMessage(message) {
    const messageElement = document.getElementById('uploadMessage');
    messageElement.innerText = message;
}
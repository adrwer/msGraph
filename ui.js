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
    }
}

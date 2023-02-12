const express = require("express"); // inport express
const router = express.Router(); // router out of express

const signupTemplateCopy = require("../models/candidateSignupModels");
const companySignupTemplateCopy = require("../models/companySignupModels");
const associationSignupTemplateCopy = require("../models/associationModels");
const providerSignupTemplateCopy = require("../models/serviceProviderModels");
const jobsTemplateCopy = require("../models/jobsModels");
const ProfessionalContentTemplateCopy = require("../models/ProfessionalContentModels");
const contactUsTemplateCopy = require("../models/ContactUsModels");

require("dotenv").config();

const multer = require("multer");
const { s3Uploadv2, s3Uploadv3 } = require("../s3Service");

const { MongoClient } = require("mongodb");
const { Collection } = require("mongoose");

var url = process.env.DATABASE_ACCESS;
var uri = process.env.DATABASE_ACCESS;

function fileFilter(req, file, cb) {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("file is not an image"), false);
  }
}
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000 },
});

router.post("/ProfileImageURL", async (request, response) => {
  console.log("i'm working");
  let usersDetailsProfileImageURL = null;
  const userType = request.body.userType;
  try {
    switch (userType) {
      case "candidate":
        usersDetailsProfileImageURL = await signupTemplateCopy.find({
          uid: request.body.uid,
        });
        break;
      case "company":
        usersDetailsProfileImageURL = await companySignupTemplateCopy.find({
          uid: request.body.uid,
        });
        break;
      case "association":
        usersDetailsProfileImageURL = await associationSignupTemplateCopy.find({
          uid: request.body.uid,
        });
      case "provider":
        usersDetailsProfileImageURL = await providerSignupTemplateCopy.find({
          uid: request.body.uid,
        });
    }
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }

  const userDetailsProfileImageURL = usersDetailsProfileImageURL[0];

  userDetailsProfileImageURL.profileImageLink = request.body.profileImageLink;

  const data = await userDetailsProfileImageURL.save();
  response.json(data);
  console.log(request.body);
});
router.post("/CoverImageURL", async (request, response) => {
  let usersDetailsCoverImageURL = "";
  const userType = request.body.userType;

  try {
    switch (userType) {
      case "candidate":
        usersDetailsCoverImageURL = await signupTemplateCopy.find({
          uid: request.body.uid,
        });
        break;
      case "company":
        usersDetailsCoverImageURL = await companySignupTemplateCopy.find({
          uid: request.body.uid,
        });
        break;
      case "association":
        usersDetailsCoverImageURL = await associationSignupTemplateCopy.find({
          uid: request.body.uid,
        });
      case "provider":
        usersDetailsCoverImageURL = await providerSignupTemplateCopy.find({
          uid: request.body.uid,
        });

        const userDetailsCoverImageURL = usersDetailsCoverImageURL[0];
        console.log("companyDet is " + userDetailsCoverImageURL);

        userDetailsCoverImageURL.coverImageURL = request.body.coverImageURL;

        const data = await userDetailsCoverImageURL.save();
        response.json(data);
        console.log(request.body);
    }

    const userDetailsCoverImageURL = usersDetailsCoverImageURL[0];

    userDetailsCoverImageURL.coverImageLink = request.body.coverImageLink;

    const data = await userDetailsCoverImageURL.save();
    response.json(data);
    console.log(request.body);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

//get
router.get("/getProfilePic", async (request, response) => {
  try {
    var client = new MongoClient(uri);

    // finding the documant

    const database = client.db("myFirstDatabase");
    const candidates = database.collection("candidates");
    const query = { uid: request.body.uid };
    const candidate = await candidates.findOne(query);

    if (candidate == null) {
      response.json("candidate is null");
    } else {
      response.json(candidate.profileImageURL);
    }
    response.end();
  } finally {
    await client.close();
  }
});
router.post("/getFullName", async (request, response) => {
  try {
    var client = new MongoClient(uri);

    // finding the documant

    const database = client.db("myFirstDatabase");
    const candidates = database.collection("candidates");
    const query = { uid: request.body.uid };

    const candidate = await candidates.findOne(query);

    if (candidate == null) {
      response.json("candidate is null");
    } else {
      response.json(candidate.firstName + " " + candidate.lastName);
    }
    response.end();
  } finally {
    await client.close();
  }
});
router.post("/getJobsByName", async (request, response) => {
  try {
    var client = new MongoClient(uri);

    // finding the documant

    const database = client.db("myFirstDatabase");
    const candidates = database.collection("jobs");
    const query = { jobName: request.body.jobName };
    const candidate = await candidates.find(query);

    if (candidate == null) {
      response.json("candidate is null");
    } else {
      response.json(candidate);
    }
    response.end();
  } finally {
    await client.close();
  }
});
router.post("/getAllJobs", async (request, response) => {
  try {
    var client = new MongoClient(uri);

    // finding the documant

    const database = client.db("myFirstDatabase");
    const jobs = database.collection("jobs");
    const query = { __v: request.body.__v };
    const job = await jobs.find(0).toArray();
    console.log(job);
    if (job == null) {
      response.json("candidate is null");
    } else {
      response.json(job);
    }
    response.end();
  } finally {
    await client.close();
  }
});
router.post("/getJobsByCompanyUID", async (request, response) => {
  try {
    var client = new MongoClient(uri);

    // finding the documant

    const database = client.db("myFirstDatabase");
    const jobs = database.collection("jobs");
    const query = { jobName: request.body.companyUid };
    const job = await jobs.find(query);

    if (job == null) {
      response.json("companyUid is null");
    } else {
      response.json(job);
    }
    response.end();
  } finally {
    await client.close();
  }
});
router.post("/getJobsByJobID", async (request, response) => {
  try {
    var client = new MongoClient(uri);

    // finding the documant

    const database = client.db("myFirstDatabase");
    const jobs = database.collection("jobs");
    console.log(request.body.jobId);
    const query = { jobId: request.body.jobId };
    console.log(query);
    const job = await jobs.findOne(query);
    console.log(job);

    if (job == null) {
      response.json("companyUid is null");
    } else {
      console.log(job);
      response.json(job);
    }
    response.end();
  } finally {
    await client.close();
  }
});
router.post("/getUserType", async (request, response) => {
  try {
    var client = new MongoClient(uri);

    // finding the documant

    const database = client.db("myFirstDatabase");
    const candidates = database.collection("candidates");
    const companies = database.collection("companies");
    const associations = database.collection("associations");
    const serviceproviders = database.collection("serviceproviders");

    const query = { uid: request.body.uid };

    const candidate = await candidates.findOne(query);
    const company = await companies.findOne(query);
    const association = await associations.findOne(query);
    const serviceprovider = await serviceproviders.findOne(query);

    if (
      candidate == null &&
      company == null &&
      association == null &&
      serviceprovider == null
    ) {
      response.json("UserType is null");
    } else {
      if (candidate != null) response.json(candidate.userType);
      if (company != null) response.json(company.userType);
      if (association != null) response.json(association.userType);
      if (serviceprovider != null) response.json(serviceprovider.userType);
    }
    response.end();
  } finally {
    await client.close();
  }
});
router.post("/getCandidateData", async (request, response) => {
  try {
    const usersDetails = await signupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetails = usersDetails[0];
    //    console.log(`userDetails=${userDetails}`)
    const data = await userDetails.save();
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/getCompanyData", async (request, response) => {
  try {
    const usersDetails = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetails = usersDetails[0];
    //    console.log(`userDetails=${userDetails}`)
    const data = await userDetails.save();
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/getAssociationData", async (request, response) => {
  try {
    const usersDetails = await associationSignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetails = usersDetails[0];
    //    console.log(`userDetails=${userDetails}`)
    const data = await userDetails.save();
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/getProviderData", async (request, response) => {
  try {
    const usersDetails = await providerSignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetails = usersDetails[0];
    //    console.log(`userDetails=${userDetails}`)
    const data = await userDetails.save();
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/getAllProfessionalContent", async (request, response) => {
  try {
    var client = new MongoClient(uri);

    // finding the documant

    const database = client.db("myFirstDatabase");
    const ProfessionalContents = database.collection("professionalcontents");
    const query = { __v: request.body.__v };
    const ProfessionalContent = await ProfessionalContents.find(
      query
    ).toArray();
    console.log(ProfessionalContent.length);
    if (ProfessionalContent == null) {
      response.json("ProfessionalContent is null");
    } else {
      response.json(ProfessionalContent);
    }
    response.end();
  } finally {
    await client.close();
  }
});
//Candidate Sign Up
router.post("/signup", (request, response) => {
  const signupUser = signupTemplateCopy({
    userType: request.body.userType,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    password: request.body.password,
    uid: request.body.uid,
    rememberMe: request.body.rememberMe,
    passInfo: request.body.passInfo,
  });
  console.log(request.body);
  signupUser
    .save()
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      response.json(error);
    });
});
router.post("/OB1Candidate", async (request, response) => {
  try {
    const usersDetailsOB1Candidate = await signupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB1Candidate = usersDetailsOB1Candidate[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB1Candidate.OB1Name = request.body.OB1Name;
    userDetailsOB1Candidate.OB1familyName = request.body.familyName;
    userDetailsOB1Candidate.salaryExpectationRange =
      request.body.salaryExpectationRange;
    userDetailsOB1Candidate.status = request.body.status;
    userDetailsOB1Candidate.phone = request.body.phone;
    userDetailsOB1Candidate.OB1mail = request.body.OB1mail;
    userDetailsOB1Candidate.currentJob = request.body.currentJob;

    userDetailsOB1Candidate.isCheckedMelave = request.body.isCheckedMelave;
    userDetailsOB1Candidate.amuta = request.body.amuta;
    userDetailsOB1Candidate.melaveFullName = request.body.melaveFullName;
    userDetailsOB1Candidate.melavePhone = request.body.melavePhone;
    userDetailsOB1Candidate.melaveMail = request.body.melaveMail;

    const data = await userDetailsOB1Candidate.save();
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB2Candidate", async (request, response) => {
  try {
    const usersDetailsOB2Candidate = await signupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB2Candidate = usersDetailsOB2Candidate[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB2Candidate.aboutMe = request.body.aboutMe;

    const data = await userDetailsOB2Candidate.save();
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB3Candidate", async (request, response) => {
  try {
    const usersDetailsOB3Candidate = await signupTemplateCopy.find({
      uid: request.body.uid,
    });
    const userDetailsOB3Candidate = usersDetailsOB3Candidate[0];

    userDetailsOB3Candidate.skills = request.body.skills;

    const data = await userDetailsOB3Candidate.save();
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB4Candidate", async (request, response) => {
  try {
    const usersDetailsOB4Candidate = await signupTemplateCopy.find({
      uid: request.body.uid,
    });
    const userDetailsOB4Candidate = usersDetailsOB4Candidate[0];

    userDetailsOB4Candidate.previousJobs = request.body.previousJobs;

    const data = await userDetailsOB4Candidate.save();
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB5Candidate", async (request, response) => {
  try {
    const usersDetailsOB5Candidate = await signupTemplateCopy.find({
      uid: request.body.uid,
    });
    const userDetailsOB5Candidate = usersDetailsOB5Candidate[0];

    userDetailsOB5Candidate.previousEducation = request.body.previousEducation;

    const data = await userDetailsOB5Candidate.save();
    response.json(data);
    console.log(request.body);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB6Candidate", async (request, response) => {
  try {
    const usersDetailsOB6Candidate = await signupTemplateCopy.find({
      uid: request.body.uid,
    });
    const userDetailsOB6Candidate = usersDetailsOB6Candidate[0];

    userDetailsOB6Candidate.wantedJob = request.body.wantedJob;
    userDetailsOB6Candidate.location = request.body.location;
    userDetailsOB6Candidate.constrains = request.body.constrains;

    userDetailsOB6Candidate.wantedJobPrivacy = request.body.wantedJobPrivacy;
    userDetailsOB6Candidate.jobTypePrivacy = request.body.jobTypePrivacy;
    userDetailsOB6Candidate.locationPrivacy = request.body.locationPrivacy;
    userDetailsOB6Candidate.constrainsPrivacy = request.body.constrainsPrivacy;

    userDetailsOB6Candidate.isWantedJobPublic = request.body.isWantedJobPublic;
    userDetailsOB6Candidate.isjobTypePublic = request.body.isjobTypePublic;
    userDetailsOB6Candidate.isWantedJobModelPublic =
      request.body.isWantedJobModelPublic;
    userDetailsOB6Candidate.isConstrainsPublic =
      request.body.isConstrainsPublic;

    userDetailsOB6Candidate.far = request.body.far;
    userDetailsOB6Candidate.hybrid = request.body.hybrid;
    userDetailsOB6Candidate.atWorkPlace = request.body.atWorkPlace;

    userDetailsOB6Candidate.fullTimeJob = request.body.fullTimeJob;
    userDetailsOB6Candidate.partTimeJob = request.body.partTimeJob;
    userDetailsOB6Candidate.freelance = request.body.freelance;
    userDetailsOB6Candidate.shifts = request.body.shifts;

    const data = await userDetailsOB6Candidate.save();
    response.json(data);
    console.log(request.body);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB7Candidate", async (request, response) => {
  try {
    const usersDetailsOB7Candidate = await signupTemplateCopy.find({
      uid: request.body.uid,
    });
    const userDetailsOB7Candidate = usersDetailsOB7Candidate[0];

    userDetailsOB7Candidate.languages = request.body.languages;

    const data = await userDetailsOB7Candidate.save();
    response.json(data);
    console.log(request.body);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB8Candidate", async (request, response) => {
  try {
    const usersDetailsOB8Candidate = await signupTemplateCopy.find({
      uid: request.body.uid,
    });
    const userDetailsOB8Candidate = usersDetailsOB8Candidate[0];

    userDetailsOB8Candidate.skillsKishurim = request.body.skillsKishurim;

    const data = await userDetailsOB8Candidate.save();
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB9Candidate", async (request, response) => {
  try {
    const usersDetailsOB9Candidate = await signupTemplateCopy.find({
      uid: request.body.uid,
    });
    const userDetailsOB9Candidate = usersDetailsOB9Candidate[0];

    userDetailsOB9Candidate.adjustments = request.body.adjustments;
    userDetailsOB9Candidate.freeAdjustments = request.body.freeAdjustments;
    userDetailsOB9Candidate.socialGroup = request.body.socialGroup;
    userDetailsOB9Candidate.socialGroupFreeText =
      request.body.socialGroupFreeText;
    userDetailsOB9Candidate.moreServices = request.body.moreServices;

    userDetailsOB9Candidate.wantEscort = request.body.wantEscort;
    userDetailsOB9Candidate.wantTraining = request.body.wantTraining;

    const data = await userDetailsOB9Candidate.save();
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

//Company Sign Up
router.post("/companySignup", (request, response) => {
  const signupCompany = companySignupTemplateCopy({
    userType: request.body.userType,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    password: request.body.password,
    uid: request.body.uid,
    rememberMe: request.body.rememberMe,
    passInfo: request.body.passInfo,
  });
  signupCompany
    .save()
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      response.json(error);
    });
});
router.post("/OB1Company", async (request, response) => {
  try {
    const usersDetailsOB1Company = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB1Company = usersDetailsOB1Company[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB1Company.companyName = request.body.companyName;
    userDetailsOB1Company.companyNum = request.body.companyNum;
    userDetailsOB1Company.companyAdress = request.body.companyAdress;
    userDetailsOB1Company.companyCity = request.body.companyCity;
    userDetailsOB1Company.companyOccupation = request.body.companyOccupation;
    userDetailsOB1Company.companyWebsite = request.body.companyWebsite;
    userDetailsOB1Company.companyNumOfWorkers =
      request.body.companyNumOfWorkers;
    userDetailsOB1Company.companyLinkedin = request.body.companyLinkedin;
    userDetailsOB1Company.companyFacebookPage =
      request.body.companyFacebookPage;

    const data = await userDetailsOB1Company.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB2Company", async (request, response) => {
  try {
    const usersDetailsOB2Company = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB2Company = usersDetailsOB2Company[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB2Company.ContactName = request.body.ContactName;
    userDetailsOB2Company.ContactJob = request.body.ContactJob;
    userDetailsOB2Company.ContactMail = request.body.ContactMail;
    userDetailsOB2Company.ContactPhone = request.body.ContactPhone;

    const data = await userDetailsOB2Company.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB3Company", async (request, response) => {
  try {
    const usersDetailsOB3Company = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB3Company = usersDetailsOB3Company[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB3Company.companyActivity = request.body.companyActivity;
    userDetailsOB3Company.companyAbout = request.body.companyAbout;
    userDetailsOB3Company.companyExperty = request.body.companyExperty;

    const data = await userDetailsOB3Company.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB4Company", async (request, response) => {
  try {
    const usersDetailsOB4Company = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB4Company = usersDetailsOB4Company[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB4Company.benefitsForWorkers = request.body.benefitsForWorkers;

    const data = await userDetailsOB4Company.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB5Company", async (request, response) => {
  try {
    const usersDetailsOB5Company = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB5Company = usersDetailsOB5Company[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB5Company.adjustmentsPossible =
      request.body.adjustmentsPossible;
    userDetailsOB5Company.additionalAdjustmentsPossible =
      request.body.additionalAdjustmentsPossible;

    const data = await userDetailsOB5Company.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB6Company", async (request, response) => {
  try {
    const usersDetailsOB6Company = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB6Company = usersDetailsOB6Company[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB6Company.diversityPolicy = request.body.diversityPolicy;

    const data = await userDetailsOB6Company.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/JobsArray", async (request, response) => {
  try {
    const usersDetailsJobArray = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsJobArray = usersDetailsJobArray[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsJobArray.myjobs = request.body.myjobs;

    const data = await userDetailsJobArray.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/getCompanyData", async (request, response) => {
  try {
    const usersDetails = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetails = usersDetails[0];
    //    console.log(`userDetails=${userDetails}`)
    const data = await userDetails.save();
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

//Association Sign Up
router.post("/associationSignup", (request, response) => {
  console.log("i'm working association");
  const associationSignup = associationSignupTemplateCopy({
    userType: request.body.userType,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    password: request.body.password,
    uid: request.body.uid,
    rememberMe: request.body.rememberMe,
    passInfo: request.body.passInfo,
  });
  associationSignup
    .save()
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      response.json(error);
    });
});
router.post("/OB1Association", async (request, response) => {
  try {
    const usersDetailsOB1Association = await associationSignupTemplateCopy.find(
      {
        uid: request.body.uid,
      }
    );
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB1Association = usersDetailsOB1Association[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB1Association.associationName = request.body.associationName;
    userDetailsOB1Association.associationNum = request.body.associationNum;
    userDetailsOB1Association.associationAdress =
      request.body.associationAdress;
    userDetailsOB1Association.associationCity = request.body.associationCity;
    userDetailsOB1Association.associationPhone = request.body.associationPhone;
    userDetailsOB1Association.associationWebsite =
      request.body.associationWebsite;
    userDetailsOB1Association.associationLinkedin =
      request.body.associationLinkedin;
    userDetailsOB1Association.associationFacebookPage =
      request.body.associationFacebookPage;

    const data = await userDetailsOB1Association.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB2Association", async (request, response) => {
  try {
    const usersDetailsOB2Association = await associationSignupTemplateCopy.find(
      {
        uid: request.body.uid,
      }
    );
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB2Association = usersDetailsOB2Association[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB2Association.ContactName = request.body.ContactName;
    userDetailsOB2Association.ContactJob = request.body.ContactJob;
    userDetailsOB2Association.ContactMail = request.body.ContactMail;
    userDetailsOB2Association.ContactPhone = request.body.ContactPhone;

    const data = await userDetailsOB2Association.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB3Association", async (request, response) => {
  try {
    const usersDetailsOB3Association = await associationSignupTemplateCopy.find(
      {
        uid: request.body.uid,
      }
    );
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB3Association = usersDetailsOB3Association[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB3Association.associationActivity =
      request.body.associationActivity;
    userDetailsOB3Association.associationAbout = request.body.associationAbout;
    userDetailsOB3Association.associationExperty =
      request.body.associationExperty;

    const data = await userDetailsOB3Association.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB4Association", async (request, response) => {
  try {
    const usersDetailsOB4Association = await associationSignupTemplateCopy.find(
      {
        uid: request.body.uid,
      }
    );
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB4Association = usersDetailsOB4Association[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB4Association.applicationFormToVolunteerFullName =
      request.body.applicationFormToVolunteerFullName;
    userDetailsOB4Association.applicationFormToVolunteerMail =
      request.body.applicationFormToVolunteerMail;

    const data = await userDetailsOB4Association.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB5Association", async (request, response) => {
  try {
    const usersDetailsOB5Association = await associationSignupTemplateCopy.find(
      {
        uid: request.body.uid,
      }
    );
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB5Association = usersDetailsOB5Association[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB5Association.targetPopulationPopulationType =
      request.body.targetPopulationPopulationType;
    userDetailsOB5Association.targetPopulationActivityArea =
      request.body.targetPopulationActivityArea;
    userDetailsOB5Association.targetPopulationAgeGroups =
      request.body.targetPopulationAgeGroups;
    userDetailsOB5Association.targetPopulationAssociationLinkedin =
      request.body.targetPopulationAssociationLinkedin;
    userDetailsOB5Association.targetPopulationAssociationFacebookPage =
      request.body.targetPopulationAssociationFacebookPage;

    const data = await userDetailsOB5Association.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
//Service Provider Sign Up
router.post("/providerSignup", (request, response) => {
  const serviceProviderSignup = providerSignupTemplateCopy({
    userType: request.body.userType,
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    password: request.body.password,
    uid: request.body.uid,
    rememberMe: request.body.rememberMe,
    passInfo: request.body.passInfo,
  });
  serviceProviderSignup
    .save()
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      response.json(error);
    });
});
router.post("/OB1Provider", async (request, response) => {
  try {
    const usersDetailsOB1Provider = await providerSignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB1Provider = usersDetailsOB1Provider[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB1Provider.providerName = request.body.providerName;
    userDetailsOB1Provider.providerNum = request.body.providerNum;
    userDetailsOB1Provider.providerAdress = request.body.providerAdress;
    userDetailsOB1Provider.providerCity = request.body.providerCity;
    userDetailsOB1Provider.Phone = request.body.Phone;
    userDetailsOB1Provider.providerWebsite = request.body.providerWebsite;
    userDetailsOB1Provider.providerLinkedin = request.body.providerLinkedin;
    userDetailsOB1Provider.providerFacebookPage =
      request.body.providerFacebookPage;

    const data = await userDetailsOB1Provider.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB2Provider", async (request, response) => {
  try {
    const usersDetailsOB2Provider = await providerSignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB2Provider = usersDetailsOB2Provider[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB2Provider.providerActivity = request.body.providerActivity;
    userDetailsOB2Provider.providerAbout = request.body.providerAbout;
    userDetailsOB2Provider.providerExperty = request.body.providerExperty;

    const data = await userDetailsOB2Provider.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB3Provider", async (request, response) => {
  try {
    const usersDetailsOB3Provider = await providerSignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB3Provider = usersDetailsOB3Provider[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB3Provider.serviceName = request.body.serviceName;
    userDetailsOB3Provider.aboutTheServise = request.body.aboutTheServise;
    userDetailsOB3Provider.price = request.body.price;

    const data = await userDetailsOB3Provider.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/OB4Provider", async (request, response) => {
  try {
    const usersDetailsOB4Provider = await providerSignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsOB4Provider = usersDetailsOB4Provider[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsOB4Provider.populationType = request.body.populationType;
    userDetailsOB4Provider.locationOfActivity = request.body.locationOfActivity;
    userDetailsOB4Provider.ageGroup = request.body.ageGroup;

    userDetailsOB4Provider.TargetPopulationProviderLinkedin =
      request.body.TargetPopulationProviderLinkedin;
    userDetailsOB4Provider.TargetPopulationProviderFacebookPage =
      request.body.TargetPopulationProviderFacebookPage;

    const data = await userDetailsOB4Provider.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
//Upload Profile pic
router.post("/upload", upload.array("file"), async (req, res) => {
  try {
    const results = await s3Uploadv2(req.files);
    console.log(results);
    return res.json({ status: "success", results });
  } catch (err) {
    console.log(err);
  }
});
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "file is too large",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "File limit reached",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "File must be an image",
      });
    }
  }
});

//UploadNewJob
router.post("/postJob", (request, response) => {
  const postJob = jobsTemplateCopy({
    companyUid: request.body.uid,
    companyName: request.body.companyName,

    jobId: request.body.jobId,

    jobName: request.body.jobName,
    jobDescription: request.body.jobDescription,
    jobRequirements: request.body.jobRequirements,
    location: request.body.location,
    salary: request.body.salary,
    jobType: request.body.jobType,
    jobModel: request.body.jobModel,
    adjustments: request.body.adjustments,
    MoreAdjustments: request.body.MoreAdjustments,

    far: request.body.far,
    hybrid: request.body.hybrid,
    atWorkPlace: request.body.atWorkPlace,

    applied: request.body.applied,
  });
  console.log(request.body);
  postJob
    .save()
    .then((data) => {
      response.json(data);
      console.log(data);
    })
    .catch((error) => {
      response.json(error);
    });
});
router.post("/jobsArr", async (request, response) => {
  console.log("jobsArr I'm working");
  try {
    const usersDetailsJobsArr = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsJobsArr = usersDetailsJobsArr[0];
    //    console.log(`userDetails=${userDetails}`)

    userDetailsJobsArr.myJobs.push(request.body);
    console.log("myJobs: " + userDetailsJobsArr.myJobs);
    const data = await userDetailsJobsArr.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/UpdatejobsArr", async (request, response) => {
  // updating the array of "myJobs" for a company after a cannidate apply for a one of it's jobs

  console.log("UpdatejobsArr is working");
  try {
    const usersDetailsJobsArr = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    const userDetailsJobsArr = usersDetailsJobsArr[0];

    //finding the index of the job in the myJobs array
    const myJobs = userDetailsJobsArr.myJobs;
    console.log("myJobs[2]= " + JSON.stringify(userDetailsJobsArr.myJobs[2]));
    const index = myJobs.findIndex((item) => item.jobId == request.body.jobId);
    console.log("index is " + index);
    /*
    const newArray = [
      ...myJobs.slice(0, index),
      request.body,
      ...myJobs.slice(index),
    ];
*/
    userDetailsJobsArr.myJobs[index].applied.push(request.body);
    console.log("myJobs[2]= " + JSON.stringify(userDetailsJobsArr.myJobs[2]));
    const data = await userDetailsJobsArr.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

/* 
router.post("/Apply", async (request, response) => {
  console.log("I'm working");
  try {
    const usersDetailsApply = await jobsTemplateCopy.find({
      jobID: request.body.jobID,
    });

    const userDetailsApply = usersDetailsApply[0];
    console.log(`request=${request.body.userDetails}`);
    console.log(JSON.stringify(request.body.userDetails));

    userDetailsApply.applied.push(request.body.userDetails);

    const data = await userDetailsApply.save();
    console.log(data);
    response.json(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
*/

//UploadProfessionalContent
router.post("/updatingMyProfessionalContent", async (request, response) => {
  let usersDetails = "";
  const userType = request.body.userType;
  console.log("updatingMyProfessionalContent i'm working :)");
  try {
    switch (userType) {
      case "company":
        usersDetails = await companySignupTemplateCopy.find({
          uid: request.body.uid,
        });
        break;
      case "association":
        usersDetails = await associationSignupTemplateCopy.find({
          uid: request.body.uid,
        });
      case "provider":
        usersDetails = await providerSignupTemplateCopy.find({
          uid: request.body.uid,
        });
    }
    const userDetails = usersDetails[0];
    userDetails.myProfessionalContent.push(request.body);
    const data = await userDetails.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/postProfessionalContent", (request, response) => {
  const postProfessionalContent = ProfessionalContentTemplateCopy({
    uid: request.body.uid,
    userType: request.body.userType,
    userDetails: request.body.userDetails,
    title: request.body.title,
    ProfessionalContentArticle: request.body.ProfessionalContentArticle,
  });
  postProfessionalContent
    .save()
    .then((data) => {
      response.json(data);
      console.log(data);
    })
    .catch((error) => {
      response.json(error);
    });
});
//others
router.post("/Apply", async (request, response) => {
  console.log("Apply I'm working");
  try {
    const usersDetailsAppliedsArr = await jobsTemplateCopy.find({
      jobId: request.body.jobId,
    });

    //    console.log(`usersDetails=${usersDetails}`)
    const userDetailsAppliedArr = usersDetailsAppliedsArr[0];
    //    console.log(`userDetails=${userDetails}`)
    console.log(request.body);
    userDetailsAppliedArr.applied.push(request.body);
    console.log("myJobs: " + userDetailsAppliedArr.applied);
    const data = await userDetailsAppliedArr.save();
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
router.post("/ApplyMyJobsArray", async (request, response) => {
  console.log("ApplyMyJobsArray I'm working");
  try {
    const usersDetailsAppliedsArr = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });
    const usersDetailsJobAppliedsArr = await jobsTemplateCopy.find({
      jobId: request.body.jobId,
    });

    const userDetailsAppliedArr = usersDetailsAppliedsArr[0];
    const userDetailsJobAppliedsArr = usersDetailsJobAppliedsArr[0];

    // finding inex of the job
    const index = userDetailsAppliedArr.myJobs.findIndex(
      (item) => item.jobId == request.body.jobId
    );
    console.log(index);

    console.log(
      "X: " + JSON.stringify(userDetailsAppliedArr.myJobs[index].applied)
    );
    console.log(userDetailsAppliedArr.myJobs[index]);
    console.log(userDetailsJobAppliedsArr);

    userDetailsAppliedArr.myJobs[index] = userDetailsJobAppliedsArr;

    console.log(
      "Y: " + JSON.stringify(userDetailsAppliedArr.myJobs[index].applied)
    );

    const data = await userDetailsAppliedArr.save();

    const usersDetailsAppliedsArr2 = await companySignupTemplateCopy.find({
      uid: request.body.uid,
    });

    const userDetailsAppliedArr2 = usersDetailsAppliedsArr2[0];

    console.log(
      "Z= " + JSON.stringify(userDetailsAppliedArr2.myJobs[index].applied)
    );
    response.json(data);
    console.log(data);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});

//UploadContactUs
router.post("/ContactUs", (request, response) => {
  const contactUs = contactUsTemplateCopy({
    uid: request.body.uid,
    userType: request.body.userType,

    name: request.body.name,
    nameOfTheApplicant: request.body.nameOfTheApplicant,
    mail: request.body.mail,
    requestSubject: request.body.requestSubject,
    ReferenceContent: request.body.ReferenceContent,
  });
  console.log(request.body);
  contactUs
    .save()
    .then((data) => {
      response.json(data);
      console.log(data);
    })
    .catch((error) => {
      response.json(error);
    });
});
module.exports = router;

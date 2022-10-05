app.auth().setPersistence('session');

/*app.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("Logged in...");
        if (dotNetHelper)
            dotNetHelper.invokeMethodAsync('Login', user.uid)
    } else {
        console.log("Logged out...");
        if (dotNetHelper)
            dotNetHelper.invokeMethodAsync('Logout')
    }
});
*/
var dotNetHelper;

function firebaseSetDotNetHelper(dot) {
    dotNetHelper = dot;
};

function firebaseLogout() {
    console.log("Loging out...");
    app.auth().signOut();
};

async function firebaseGooglePopupLogin() {
    try {
        const result = await app.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
        // The signed-in user info.
        const user = result.user;
        return user;
    }
    catch (err) {
        return null;
    }
};

function firebaseGetUid() {
    const user = app.auth().currentUser;
    if (user) {
        return user.uid;
    }
    else {
        return "";
    }
};

async function firebaseEmailSignIn(email, password) {
    try {
        const ret = await app.auth().signInWithEmailAndPassword(email, password);

        return ret.user;
    }
    catch (err) {
        console.log(err);
        return null;
    }
};

async function firebaseEmailSignup(email, password) {
    try {
        const ret = await app.auth().createUserWithEmailAndPassword(email, password);

        return ret.user;
    }
    catch {
        return null;
    }
}

function firebaseRetriveCurrentUser() {
    return app.auth().currentUser;
};

async function firebaseGetCharacterPreviews() {
    const chars = await app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .get();

    const ret = [];

    chars.forEach(x => {
        ret.push([x.id, x.get("FullName")]);
    });

    return ret;
};

async function firebaseGetCharacter(cid) {
    const docRef = await app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(cid);

    const temp = await docRef.get();
    const char = temp.data();
    const skills = [];

    const skillRef = await docRef.collection("Skills").get();

    skillRef.forEach(x => {
        skills.push(x.data());
    });

    char.Skills = skills;

    const talents = [];

    const talentRef = await docRef.collection("Talents").get();

    talentRef.forEach(x => {
        talents.push(x.data());
    });

    char.Talents = talents;

    const effects = [];

    const effectRef = await docRef.collection("Effects").get();

    effectRef.forEach(x => {
        effects.push(x.data());
    });

    char.Effects = effects;

    const trappings = [];

    const trappingRef = await docRef.collection("Trappings").get();

    trappingRef.forEach(x => {
        trappings.push(x.data());
    });

    char.Trappings = trappings;

    const characteristics = [];

    const characteristicsRef = await docRef.collection("Characteristics").get();

    characteristicsRef.forEach(x => {
        characteristics.push(x.data());
    });

    char.Characteristics = characteristics;


    const memorizedSpells = [];

    const memorizedSpellsRef = await docRef.collection("MemorizedSpell").get();

    memorizedSpellsRef.forEach(x => {
        memorizedSpells.push(x.data());
    });

    char.MemorizedSpells = memorizedSpells;//MemorizedSpells

    const manifestedPrayers = [];

    const manifestedPrayersRef = await docRef.collection("ManifestedPrayers").get();

    manifestedPrayersRef.forEach(x => {
        manifestedPrayers.push(x.data());
    });

    char.ManifestedPrayers = manifestedPrayers;


    const careers = [];

    const careersRef = await docRef.collection("Careers").get();

    careersRef.forEach(x => {
        careers.push(x.data());
    });

    char.CareerPath = careers;

    return JSON.stringify(char);
};

async function firebasePushNewCharacter(json) {
    const c = JSON.parse(json);

    const skills = c.Skills;
    const talents = c.Talents;
    const effects = c.Effects;
    const trappings = c.Trappings;
    const characteristics = c.Characteristics;
    const memorizedSpells = c.MemorizedSpells;
    const manifestedPrayers = c.ManifestedPrayers;
    const careers = c.CareerPath;

    delete c.Skills;
    delete c.Talents;
    delete c.Trappings;
    delete c.Effects;
    delete c.Characteristics;
    delete c.MemorizedSpells;
    delete c.ManifestedPrayers;
    delete c.CareerPath;

    const docRef = await app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .add(c);

    const skillCol = docRef.collection("Skills");

    skills.forEach(x => {
        skillCol.add(x);
    });


    const talentCol = docRef.collection("Talents");

    talents.forEach(x => {
        talentCol.add(x);
    });

    const effectCol = docRef.collection("Effects");

    effects.forEach(x => {
        effectCol.add(x);
    });

    const trappingCol = docRef.collection("Trappings");

    trappings.forEach(x => {
        trappingCol.doc(x.Id).set(x);
    });

    const characteristicsCol = docRef.collection("Characteristics");

    characteristics.forEach(x => {
        characteristicsCol.doc(x.Name).set(x);
    });

    const memorizedSpellsCol = docRef.collection("MemorizedSpell");

    memorizedSpells.forEach(x => {
        memorizedSpellsCol.add(x);
    });

    const manifestedPrayersCol = docRef.collection("ManifestedPrayers");

    manifestedPrayers.forEach(x => {
        manifestedPrayersCol.add(x);
    });

    const careersCol = docRef.collection("Careers");

    careers.forEach(x => {
        careersCol.doc(x.index+"").set(x);
    });

    console.log("ID:" + docRef.id)
    return docRef.id;
};

async function firebaseUpdateCharacter(id, value) {
    const obj = JSON.parse(value)

    const skills = c.Skills;
    const talents = c.Talents;
    const effects = c.Effects;
    const trappings = c.Trappings;
    const characteristics = c.Characteristics;
    const memorizedSpells = c.MemorizedSpells;
    const manifestedPrayers = c.ManifestedPrayers;
    const careers = c.CareerPath;

    delete c.Skills;
    delete c.Talents;
    delete c.Effects;
    delete c.Trappings;
    delete c.Characteristics;
    delete c.MemorizedSpells;
    delete c.ManifestedPrayers;
    delete c.CareerPath;

    await app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(id)
        .set(obj);

    docRef.collection("Skills").forEach(x => x.delete());
    const skillCol = docRef.collection("Skills");

    skills.forEach(x => {
        skillCol.add(x);
    });

    docRef.collection("Talents").forEach(x => x.delete());
    const talentCol = docRef.collection("Talents");

    talents.forEach(x => {
        talentCol.add(x);
    });

    docRef.collection("Effects").forEach(x => x.delete());
    const effectCol = docRef.collection("Effects");

    effects.forEach(x => {
        effectCol.add(x);
    });

    docRef.collection("Trappings").forEach(x => x.delete());
    const trappingCol = docRef.collection("Trappings");

    trappings.forEach(x => {
        trappingCol.doc(x.Id).set(x);
    });

    docRef.collection("Characteristics").forEach(x => x.delete());
    const characteristicsCol = docRef.collection("Characteristics");

    characteristics.forEach(x => {
        characteristicsCol.doc(x.Name).set(x);
    });


    docRef.collection("MemorizedSpell").forEach(x => x.delete());
    const memorizedSpellsCol = docRef.collection("MemorizedSpell");

    memorizedSpells.forEach(x => {
        memorizedSpellsCol.add(x);
    });


    docRef.collection("ManifestedPrayers").forEach(x => x.delete());
    const manifestedPrayerCol = docRef.collection("ManifestedPrayers");

    manifestedPrayers.forEach(x => {
        manifestedPrayerCol.add(x);
    });


    docRef.collection("Careers").forEach(x => x.delete());
    const careersCol = docRef.collection("Careers");

    careers.forEach(x => {
        careersCol.doc(x.index).set(x);
    });



};

function firebaseUpdateField(characterId, value) {
    const obj = JSON.parse(value)
    app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(characterId)
        .update(obj);
};

async function firebaseUpdateSkillField(charId, skillName, skillSpec, value) {
    const obj = JSON.parse(value);

    const skillColRef = app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("Skills");

    const colRef = await
        skillColRef.where("Name", "==", skillName)
        .where("Specialisation", "==", skillSpec)
        .limit(1)
        .get();

    colRef.forEach(x => {
        skillColRef.doc(x.id).update(obj);
    });
        
}

async function firebaseAddSkill(charId, value) {
    const obj = JSON.parse(value);

    const skillColRef = app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("Skills");

    skillColRef.add(obj);
}


async function firebaseUpdateTalentField(charId, TalentName, value) {
    const obj = JSON.parse(value);

    const TalentColRef = app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("Talents");

    const colRef = await TalentColRef
        .where("Name", "==", TalentName)
        .limit(1)
        .get();

    colRef.forEach(x => {
        TalentColRef.doc(x.id).update(obj);
    });

}

async function firebaseAddTalent(charId, value) {
    const obj = JSON.parse(value);

    const TalentColRef = app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("Talents");

    TalentColRef.add(obj);
}

async function firebaseUpdateEffect(charId, value) {
    const obj = JSON.parse(value)
    const id = obj.Id;

    const EffectColRef = app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("Effects");

    const colRef = await EffectColRef
        .where("Id", "==", id)
        .get();

    colRef.forEach(x => {
        EffectColRef.doc(x.id).set(obj);
    });
}

async function firebaseAddEffect(charId, value) {
    const obj = JSON.parse(value);

    const EffectColRef = app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("Effects");

    EffectColRef.add(obj);
}

async function firebaseRemoveEffect(charId, effectID) {
    const EffectColRef = app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("Effects");

    const colRef = await EffectColRef
        .where("Id", "==", effectID)
        .get();

    colRef.forEach(async x => {
        await EffectColRef.doc(x.id).delete();
    })
}

async function firebaseUpdateTrappingPosition(charId, trapId, contId, index) {
    const obj = {
        ContainedIn: contId,
        IndexInContainer: index
    };

    await app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("Trappings")
        .doc(trapId)
        .update(obj);
}

async function firebaseUpdateTrappingField(charId, trapId, value) {
    const obj = JSON.parse(value);

    await app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("Trappings")
        .doc(trapId)
        .update(obj);
}

async function firebaseAddTrapping(charId, trap) {
    const obj = JSON.parse(trap);
    const trapId = trap.Id;


    await app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("Trappings")
        .doc(trapId)
        .set(obj);
}

async function firebaseUpdateCharacteristicField(charId, characteristicName, value) {
    const obj = JSON.parse(value);

    await  app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("Characteristics")
        .doc(characteristicName)
        .update(obj);
}

async function firebaseAddMemorizedSpell(charId, value) {
    const obj = JSON.parse(value);

    const MemorizedSpellColRef = app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("MemorizedSpell");

    MemorizedSpellColRef.add(obj);
}


async function firebaseAddManifestedPrayer(charId, value) {
    const obj = JSON.parse(value);

    const ManifestedPrayerColRef = app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection("ManifestedPrayers");

    ManifestedPrayerColRef.add(obj);
}

async function firebaseAddCareer(charId, id, c) {
    const obj = JSON.parse(c);

    await app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection('Careers')
        .doc(id+"")
        .set(obj);
}

async function firebaseUpdateCareerField(charId, id, value) {
    const obj = JSON.parse(value);

    const ref = app.firestore().collection("Users")
        .doc(firebase.auth().currentUser.uid)
        .collection("Characters")
        .doc(charId)
        .collection('Careers')
        .doc(id+"");

    await ref.update(obj);
}
window.onload = function()
{
    var RealEstate =
    {
        imageButtons: document.querySelectorAll("#imageSelectorContainer a"),

        allMarkings: document.querySelectorAll(".markingWithLabel"),
        apartmentMarkings: document.querySelectorAll(".markingWithLabel.apartment"),
        hotelMarkings: document.querySelectorAll(".markingWithLabel.hotel"),
        museumMarkings: document.querySelectorAll(".markingWithLabel.museum"),

        locationName: document.querySelector("#locationName"),
        locationAddress: document.querySelector("#locationAddress"),

        typeSelector: document.getElementById("typeSelector"),
        image: document.getElementById("image"),

        eventImage: document.querySelector(".eventImage"),
        eventLocation: document.querySelector(".eventLocation"),
        eventTitle: document.querySelector(".eventTitle"),
        eventDate: document.querySelector(".eventDate"),

        selectedMarking: null,

        currentImageIndex: -1,
        currentInfo: null,

        infos:
        [
            { title: "A1", address: "Prilaz tvornici 10", images: ["images/A1/1.jpg", "images/A1/2.jpg", "images/A1/3.jpg"], type: "apartment"},
            { title: "A2", address: "Obala 6", images: ["images/A2/1.jpg", "images/A2/2.jpg", "images/A2/3.jpg"], type: "apartment"},
            { title: "H1", address: "Obala 10", images: ["images/H1/1.jpg", "images/H1/2.jpg", "images/H1/3.jpg"], type: "hotel"},
            { title: "H2", address: "Biogradska 7", images: ["images/H2/1.jpg", "images/H2/2.jpg", "images/H2/3.jpg"], type: "hotel"},
            { title: "A3", address: "Drvarska 4", images: ["images/A3/1.jpg", "images/A3/2.jpg", "images/A3/3.jpg"], type: "apartment"},
            { title: "M1", address: "Ninica 3", images: ["images/M1/1.jpg", "images/M1/2.jpg", "images/M1/3.jpg"], type: "museum"},
            { title: "H3", address: "Trlaje 11", images: ["images/H3/1.jpg", "images/H3/2.jpg", "images/H3/3.jpg"], type: "hotel"},
            { title: "A4", address: "Zvonimirova 16", images: ["images/A4/1.jpg", "images/A4/2.jpg", "images/A4/3.jpg"], type: "apartment"}
        ],

        currentEventIndex: -1,

        events:
        [
            { location: "Vodice", date: "29/07/2013 - 30/07/2013", title: "Jazz festival", image: "images/thumbnails/vodice.jpg"},
            { location: "Skradin", date: "01/05/2013 - 02/05/2013", title: "Eco & ethno fair", image: "images/thumbnails/Skradin.jpg"},
            { location: "Šibenik", date: "22/06/2013 - 07/07/2013", title: "Children’s Festival", image: "images/thumbnails/sibenik.jpg"}
        ],

        setNextEvent: function()
        {
            this.currentEventIndex = (this.currentEventIndex + 1) % this.events.length;

            this.eventImage.src = this.events[this.currentEventIndex].image;
            this.eventLocation.textContent = this.events[this.currentEventIndex].location;
            this.eventTitle.textContent = this.events[this.currentEventIndex].title;
            this.eventDate.textContent = this.events[this.currentEventIndex].date;
        },

        setInfo: function(index)
        {
            if(this.selectedMarking != null)
            {
                this.selectedMarking.className = this.selectedMarking.className.replace(/(\s)*selectedMarking(\s)*/g, "");
            }

            this.selectedMarking = this.allMarkings[index];

            if(this.selectedMarking != null)
            {
                this.selectedMarking.className += " selectedMarking";

                this.currentInfo = this.infos[index];

                this.locationName.textContent = this.currentInfo.title;
                this.locationAddress.textContent = this.currentInfo.address;
                RealEstate.setImage(0);
            }
        },

        showAll: function()
        {
            for(var i = 0; i < RealEstate.allMarkings.length; i++)
            {
                RealEstate.allMarkings[i].style.display = "block";
            }
        },

        hideAll: function()
        {
            for(var i = 0; i < RealEstate.allMarkings.length; i++)
            {
                RealEstate.allMarkings[i].style.display = "none";
            }
        },

        showApartments: function()
        {
            this.hideAll();

            for(var i = 0; i < RealEstate.apartmentMarkings.length; i++)
            {
                RealEstate.apartmentMarkings[i].style.display = "block";
            }

            RealEstate.setInfo(RealEstate._getFirstApartmentIndex());
        },

        showHotels: function()
        {
            this.hideAll();

            for(var i = 0; i < RealEstate.hotelMarkings.length; i++)
            {
                RealEstate.hotelMarkings[i].style.display = "block";
            }

            RealEstate.setInfo(RealEstate._getFirstHotelIndex());
        },

        showMuseums: function()
        {
            this.hideAll();

            for(var i = 0; i < RealEstate.museumMarkings.length; i++)
            {
                RealEstate.museumMarkings[i].style.display = "block";
            }

            RealEstate.setInfo(RealEstate._getFirstMuseumIndex());
        },

        _getFirstApartmentIndex: function()
        {
            for(var i = 0; i < RealEstate.infos.length; i++)
            {
                if(RealEstate.infos[i].type == "apartment")
                {
                    return i;
                }
            }
        },

        _getFirstHotelIndex: function()
        {
            for(var i = 0; i < RealEstate.infos.length; i++)
            {
                if(RealEstate.infos[i].type == "hotel")
                {
                    return i;
                }
            }
        },

        _getFirstMuseumIndex: function()
        {
            for(var i = 0; i < RealEstate.infos.length; i++)
            {
                if(RealEstate.infos[i].type == "museum")
                {
                    return i;
                }
            }
        },

        registerMapClicks: function()
        {
            for(var i = 0; i < RealEstate.allMarkings.length; i++)
            {
                (function(index)
                {
                    RealEstate.allMarkings[index].onclick = function()
                    {
                        RealEstate.setInfo(index);
                    };
                })(i);
            }
        },

        registerOfferClicks: function()
        {
            for(var i = 0; i < RealEstate.imageButtons.length; i++)
            {
                RealEstate.imageButtons[i].onclick = function()
                {
                    RealEstate.setImage(RealEstate.getButtonIndex(this));
                    return false;
                };
            }
        },

        getButtonIndex: function(button)
        {
            for(var i = 0; i < RealEstate.imageButtons.length; i++)
            {
                if(RealEstate.imageButtons[i] == button)
                {
                    return i;
                }
            }
        },

        selectPicture: function(index)
        {
            RealEstate.setImage(index);
        },

        setImage: function(index)
        {
            RealEstate.image.src = RealEstate.currentInfo.images[index];

            RealEstate.selectImageButton(index);

            RealEstate.currentImageIndex = index;
        },

        selectImageButton: function(buttonIndex)
        {
            for(var i = 0; i < RealEstate.imageButtons.length; i++)
            {
                RealEstate.imageButtons[i].className = "";
            }

            RealEstate.imageButtons[buttonIndex].className = "active";
        }
    };

    RealEstate.typeSelector.onchange = function()
    {
        if(RealEstate.typeSelector.value == "All")
        {
            RealEstate.showAll();
        }
        else if(RealEstate.typeSelector.value == "Apartments")
        {
            RealEstate.showApartments();
        }
        else if(RealEstate.typeSelector.value == "Hotels")
        {
            RealEstate.showHotels();
        }
        else if(RealEstate.typeSelector.value == "Museums")
        {
            RealEstate.showMuseums();
        }
    };

    document.onkeydown = function(e)
    {
        if(e.keyCode == 65)
        {
            RealEstate.showApartments();
        }
        else if(e.keyCode == 72)
        {
            RealEstate.showHotels();
        }
        else if(e.keyCode == 77)
        {
            RealEstate.showMuseums();
        }
        else if(e.keyCode == 49)
        {
            RealEstate.selectPicture(0);
        }
        else if(e.keyCode == 50)
        {
            RealEstate.selectPicture(1);
        }
        else if(e.keyCode == 51)
        {
            RealEstate.selectPicture(2);
        }
    };

    window.setInterval(function()
    {
        RealEstate.setNextEvent();
    }, 5000);

    RealEstate.setInfo(0)

    RealEstate.registerOfferClicks();
    RealEstate.registerMapClicks();
    RealEstate.setNextEvent();

    document.getElementById("mapImage").onclick = function()
    {
        if(this.src.indexOf("High") != -1)
        {
            this.src = "images/CountyMap.png";
        }
        else
        {
            this.src = "images/CountyMapHigh.png";
        }
    };
};
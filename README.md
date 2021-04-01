# What

The ~~LCMS~~ GCMS is a digital system that allows flexible management of information about the laboratory (and, in fact, any other organisation) that falls outside the LIS target area. 

From my own practical experience I know that a software package for this is hard to find, and often cannot fully meet the needs of the lab. The lack of functionalities and flexibility is the reason why I started this project.

To start with, there is a very big plus: it is free and can be adapted and used by everyone.

The three largest functionalities that will be further developed first are:

A document management system: a system in which the documents are subject to extensive control before they become official. These documents must be reviewed periodically and the changes are fully traceable.
A non-compliance system: a system in which events are noted that do not conform to the normal or intended functioning of a system. In this system, all incidents are followed up and submitted to a responsible person for approval before they receive a completed status.

Any other system (e.g. competence managent, inventory management, ERP,...) can be developed without increasing the code base thanks to the use of the [pf4j](https://github.com/pf4j/pf4j) plugin sytem. 

While using java as the backend language this software relies on javascript for the front-end. Together with some opensource javascript-libaries one can create and edit (javascript) content in the browser, on the fly. 


# For whom

The software is written in the context of a clinical laboratory, but actually applies in extend to a broad spectrum of buisinesses. Because this project is open source, anyone who wants to copy and modify this project can. One can also help to develop it.

# Where to obtain

The full project can be found at https://github.com/MatthiasDM/LCMS.

To get started with this project a number of other (free) software packages are needed:

JDK 8 or higher
MongoDB: the database software
Netbeans: the IDE (development environment) in which this project is written
#Development
This project is in full development and is therefore subject to change. Functionalities can be created, updated or even deleted.

Software packages must, certainly in a laboratory, be validated and verified. Due to the transparent nature of this project, all source code can be found on Github. 

# Technical documentation

Technical documentation will be found on the Github wiki page.

# Feature development

- [ ] Upload pictures from mobile phones
- [x] Create database architecture
- [x] Integrate JqgridFree into CKeditor
- [x] Create API-architecture to allow communication with other web services
- [x] Persist downloaded items form publicly available documents in fixed folder

# Contact

matthias@s-dm.be

[S-DM: IT solutions](http://www.s-dm.be/index.html?p=pages&k=title&v=LCMS)



*Disclaimer: This software is completely open source and the responsibility for the use and the consequences thereof falls entirely on the end user. The software developers cannot be held liable in any way for any errors.*

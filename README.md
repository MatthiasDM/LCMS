# LCMS
Laboratory Content Management System

LCMS is a content management system specifically designed for use in (clinical, or other) laboratories.
While this software is designed for use in a Belgian hospital laboratory, it may be of use in other settings. 

The system will consist out of multiple modules, the first one being a document management system.

## Modules

1. Document management
      - Versioning
      - Full history
      - Workflows
2. Nonconformity management
      - Action management
      - Workflows
3. Inventory management
4. Skill management

### Behind the scenes

#### 1. Rights management
All fields of the tables defined in Java are under access control. At the moment this is hard-coded into Java, but the goal is to create a module where these access rights are defined in the database, and are thus modifiable for those who have the rights to do so. 
#### 2. Workflows
These workflows need to be hard-coded into Java. When i have time i will think about a way to define these workflows in a more abstract way.

### Lab specific

1. Lab structure management
      - Lab sites
      - Workplaces
      - Machines

## Progress

### Document management

- [x] Working on the editabiliy of documents. Two main libraries are used: CKeditor4 and Free-JqGrid.
- [x] (partial) Make it possible to reference from one table to another withing the samen document
- [ ] Upload image on paste  
- [x] Export entire document to HTML.
- [x] Export table (jqGrid) to csv.
- [x] (partial) Modify jqGrid definition at will.
- [x] (partial) Change position of CKEditor-fields and jqGrid-tables at will (needs to refresh when done).

### Rights management

- [ ] Databasify the rights system. 

### Nonconformity management
At the moment this module is only used to monitor IT-related problems. 

- [ ] Create extra field to defined the action type. 
- [ ] Complete the workflows

#### IT-problems
IT-problems are registered by any user who has right to do so. The follow-up of these problems happen by the IT-personel. At the moment there are four statusfields of an IT-problem. These are used in de workflow below:
- Registered: IT-personel is informed of the problem.
- Analysis: Status change done by IT-personel. Inidcates the problem is under investigation. In this stage the follow-up field is edited and appended to. 
- Validation: Status changed caused by IT-personel. The solution is to be validated by the assigned person, prefferable a non-IT-personel. 
- Complete: The validator has confirmed the problem is solved. 

- [ ] Create extra field for subcategory specification, this is to group problems more easily. 
- [ ] Complete the workflow. 
- [ ] Use the module "Tasks" for centralisation of workflow-tasks. 
- [ ] A "Task" is found in a jqGrid where all "Tasks" are shown. An IT-related task will redirect to the problem in the Nonconformity management module. A validation task to confirm a problem is solved will show the follow-up of the problem and will have a link that send a server-request to change the status of the ticket, which will 'complete' the task.
- [ ] Change mark-up of email notifications.


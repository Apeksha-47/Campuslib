require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function seed() {
  console.log('Seeding database...');
  const adminPass = await bcrypt.hash('admin123', 10);
  await db.query(`INSERT INTO users (name,email,password,role,college_id,department) VALUES ('Admin User','admin@library.edu',$1,'admin','ADMIN001','Administration') ON CONFLICT (email) DO NOTHING`,[adminPass]);
  const libPass = await bcrypt.hash('lib123', 10);
  await db.query(`INSERT INTO users (name,email,password,role,college_id,department) VALUES ('Priya Sharma','librarian@library.edu',$1,'librarian','LIB001','Library') ON CONFLICT (email) DO NOTHING`,[libPass]);
  const stuPass = await bcrypt.hash('CS2021001', 10);
  await db.query(`INSERT INTO users (name,email,password,role,college_id,department) VALUES ('Arjun Mehta','arjun@student.edu',$1,'student','CS2021001','Computer Science') ON CONFLICT (email) DO NOTHING`,[stuPass]);
  const books = [
    [null,'To Kill a Mockingbird','Harper Lee','HarperCollins',1960,'Fiction','813.54',3],
    [null,'1984','George Orwell','Secker',1949,'Fiction','823.912',2],
    [null,'Sapiens','Yuval Noah Harari','Harper',2011,'History','909',3],
    [null,'Introduction to Algorithms','Cormen et al.','MIT Press',2009,'Technology','005.1',4],
    [null,'Clean Code','Robert C. Martin','Prentice Hall',2008,'Technology','005.13',3],
  ];
  for (const [isbn,title,author,publisher,year,genre,dewey,copies] of books) {
    await db.query(`INSERT INTO books (isbn,title,author,publisher,year,genre,dewey_class,total_copies,avail_copies) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8) ON CONFLICT DO NOTHING`,[isbn,title,author,publisher,year,genre,dewey,copies]);
  }
  console.log('Seed complete!');
  console.log('Admin:     admin@library.edu / admin123');
  console.log('Librarian: librarian@library.edu / lib123');
  console.log('Student:   arjun@student.edu / CS2021001');
  process.exit(0);
}
seed().catch(e=>{console.error(e);process.exit(1);});

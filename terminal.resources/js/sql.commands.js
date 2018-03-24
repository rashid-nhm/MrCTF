var db = undefined;

function create_database() {
	db = new SQL.Database();

	var sqlstr = "CREATE TABLE Users(name, password);";
	sqlstr += "INSERT INTO Users(name, password) VALUES('Rashid', 'cisco123');";
	sqlstr += "INSERT INTO Users(name, password) VALUES('Thomas', 'cisco321');";
	sqlstr += "INSERT INTO Users(name, password) VALUES('Garrett', 'btc123');";
	sqlstr += "INSERT INTO Users(name, password) VALUES('Matt', 'ltc123');";
	

	sqlstr += "CREATE TABLE Profile(id, name, email);";
	for (var i = 0; i < 10; i++) {
		sqlstr += "INSERT INTO Profile(id, name, email) VALUES(" + String(Math.random()) + "," + String(Math.random()) + "," + String(Math.random()) + ");";
	}

	sqlstr += "CREATE TABLE Fl4g(flag);";
	sqlstr += "INSERT INTO Fl4g(flag) VALUES('\n*************************************\n     CONGRATS YOU FOUND A FLAG\n  1BA2BF54B6C052ED37BF63D88F104D72\n*************************************\n');";

	db.run(sqlstr);
};

function database_exists() { 
	return db != undefined; 
}

function run_select(command) {
	try {
		if (!db) { create_database(); }
	
		if (command.trim() == "") { return ""; }
	
		var stmt = db.prepare(command);
	
		var ret_text = "";
	
		while (stmt.step()) {
			var row = stmt.get();
			for (var i = 0; i < row.length; i++){
				ret_text += row[i] + " | ";
			}
			ret_text += "\n";
		}
		return ret_text;
	}
	catch(err) {
		throw "Invalid command. Valid SQL statement expected.";
	}
};

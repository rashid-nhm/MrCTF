function clean_array(x) {
	var index = -1,
        arr_length = x ? x.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arr_length) {
        var value = x[index];

        if (value) {
            result[++resIndex] = value;
        }
    }
    return result;
};

function get_prompt(current_directory){
	var pres_prompt = "~";
	if (current_directory === "/home/elliot/") { pres_prompt = "~"; }
	else {
	dir = current_directory.split('/')
	for (var i = 3; i < dir.length; i++) {
		if (dir[i].trim() != ""){ pres_prompt += "/" + dir[i]; }
		}
	}
	return "elliot.alderson@allsafe:" + pres_prompt + "$";
};

function get_help() {
	return "cat <file>          Read contents of a file\n" +
			"cd <dir>            Change directory\n" + 
			"ls                  List all files in the directory\n" + 
			"man <cmd>           More information about a command\n" + 
			"nslookup <domain>   Get the IP of a domain\n" +
			"pwd                 Print the present working directory\n" +
			"sql <db>            Enter SQL mode by reading a database file\n" +
			"ssh <ip>            SSH to remote system using IP only";
};

function get_command_info(command) {
	command = clean_array(command.trim().split(' '));
	var ret_txt = "";
	var cmds = ['cat' ,'cd', 'ls', 'nslookup', 'pwd', 'sql', 'ssh', 'man'];
	if (command.length == 2 && cmds.indexOf(command[1]) > -1) {
		cmd = command[1];
		if (cmd == 'ls') {
			return "\nReturns all files in the current directory\n" + 
				   "Flags:\n" + 
				   "-l           List the files showing permission\n" + 
				   "-a           List any hidden files\n";
		} else if (cmd == "pwd") {
			return "\nPrints the full current working directory\n";
		} else if (cmd == "cd") {
			return "\nChange the current working directory to the directory specified.\n" + 
				   "The 'cd' command in this emulator can only be used to enter/exit ONE FOLDER AT A TIME\n" + 
				   "\nUSAGE:\ncd <folder_name>      Go into a directory\ncd ..                 Go up a directory\n";
		} else if (cmd == "cat") {
			return "\nOutput the contents of a text file. Will only work with files in the same directory as user" +
					"\n\nUSAGE:\ncat <file>          Output the content of file\n";
		} else if (cmd == "nslookup") {
			return "\nThis is the only way in this emulator to resolving a hostname.\n" +
			       "\nUSAGE:\nnslookup <domain>          Outputs the IP address of the domain/host\n";
		} else if (cmd == "sql") {
			return "\nOpen SQL emulator with a database file.\n"+
			       "\nUSAGE:\nsql <db_file>   Database file to be opened into SQL\n";
		} else if (cmd == "ssh") {
			return "\nAllows user to remote into another Host. CANNOT resolve hostnames\n" + 
				   "\nUSAGE:\n ssh <ip>    IP of remote host\n" + 
				   "\nPlease note, username and port is not required\n";
		} else if (cmd == "man") {
			return "\n*************************************\n     CONGRATS YOU FOUND A FLAG\n  8077BF01E17BB9C60AADF163523AD8C6\n*************************************\n";
		}
	}
	else { return "Invalid man command"; }
};

function list_directory(command, current_directory) {
	command = clean_array(command.trim().split(' '));
	flags = command.slice(1, command.length);
	
	var files = [];
	
	ret_txt = ""
	
	var show_hidden = false;
	var show_perms = false;
	for (var i = 0; i < flags.length; i++) {
		if (flags[i].indexOf("a") > -1) {
			show_hidden = true;
		}
		if (flags[i].indexOf("l") > -1) {
			show_perms = true;
		}
	}
	
	if (current_directory.endsWith("elliot/")){
		files = [["drw-r--r--", "0 MB", "Downloads/"], 
				 ["dwr-rw-rw-", "5 KB", "Notes/"], 
				 ["drwxrw-rw-", "1 MB", "Database/"],
				 ["-rw-rw-r--", "2 KB", "README.txt"]];
		if (show_hidden) {
			files.splice(0, 0, ["-r--r--r--","1 KB",".flag.txt"]);
		}
	} else if (current_directory.endsWith("Notes/")){
		if (show_hidden) {
			files.push(["-rw-r--r--", "2 KB", ".ecorp_cc_storage.txt"]);
		}
	} else if (current_directory.endsWith("Database/")){
		files.push(["-rwxrwxrwx", "50 MB", "user_profiles.db"]);
	}
	for (var i = 0; i < files.length; i++){
		if (show_perms) {
			for (var j = 0; j < files[i].length; j++) {
				ret_txt += files[i][j] + "\t\t";
			}
			ret_txt += "\n";
		}
		else { ret_txt += files[i][2] + "\t\t"; }
	}
	return ret_txt;
};

function read_file(command, current_directory){
	command = clean_array(command.trim().split(' '));
	var file_name = command[command.length - 1];
	if (current_directory.endsWith("elliot/")) {
		if (file_name == ".flag.txt") {
			return "\n*************************************\n     CONGRATS YOU FOUND A FLAG\n  7DB68B5090795E2C3A3FBDD97C883592\n*************************************\n";
		} else if (file_name == "README.txt") {
			return "This is Allsafe's core server for hosting E-Corps services. Please be cautious in using any commands as everything is being logged\n\n" + 
					"It should be noted that this is an emulation of a terminal with very minimal functionality. There are a total of 5 flags here, see if you\n" +
					"are able to find all of them!\n\nGive yourself a pat on the back if you can find all of them from the terminal.";
		}
		else { return "Invalid 'cat' command! File may not exist"; }
	} else if (current_directory.endsWith("Notes/")) {
		if (file_name == ".ecorp_cc_storage.txt") {
			return "E-Corp stores all their credit card information in a remote storage server at: \n" + 
				   "\ncc.data.ecorp.com\n\nTo make management easy, AllSafe has enabled remote access on it.\n" + 
				   "Just make sure you know the alias command to read the hidden file when troubleshooting.\n" + 
				   "\nHint: Never lose track of your identity.\n";
		}
	}
};

function cd_error() { throw "Invalid 'cd' command! You can only move 1 directory at a time"; };

function change_directory(command, current_directory){
	command = clean_array(command.trim().split(' '));
	if (command.length == 1) { return ["/home/elliot/", get_prompt("/home/elliot/")]; }
	else if (command.length != 2 || command[1].indexOf("/") != -1) {
		cd_error();
	}
	folder = command[1].trim();
	if (folder == "..") {
		if (!current_directory.endsWith("elliot/")){
			current_directory = current_directory.split("/");
			current_directory = current_directory.splice(0, current_directory.length - 2).join("/") + "/";
		} else { throw "Permission Denied! Not allowed to move out of home directory"; }
	} else if (current_directory.endsWith("elliot/")) {
		if (["Downloads", "Notes", "Database"].indexOf(folder) > -1) {
			current_directory += folder + "/";
		} else { throw "Folder does not exist"; }
	} else { cd_error(); }
	return [current_directory, get_prompt(current_directory)];
};

function host_lookup(command) {
	var hosts = {
		"cc.data.ecorp.com" : "184.27.216.34", //whoismrrobot.com
		"give_flag_ples" : "\n*************************************\n     CONGRATS YOU FOUND A FLAG\n  D4B3ECDCAF1C5D58BCCD1520E2CD538C\n*************************************\n"
	};
	command = clean_array(command.trim().split(' '));
	if (command.length == 1) { return "Please see 'man nslookup' for usage details"; }
	else {
		if (command.length != 2) { throw "ERROR can only lookup one hostname at a time"; }
		else if (command[1] in hosts) { return "\nName: " + command[1] + "\nAddress: " + hosts[command[1]] + "\n"; }
		else { throw "Unable to resolve hostname"; }
	}
};

function remote_access(command) {
	var allowed_ip = ["184.27.216.34"];
	var allowed_port = ["22"]
	
	var user = "allsafe"
	var has_user = false;
	var is_allowed = true;
	
	command = clean_array(command.trim().split(' '));
	if (command.length == 1) { throw "You must specify a remote address"; }
	if (command[1].indexOf("@") > -1) {
		user = command[1].substring(0, command[1].indexOf("@"));
		if (user.trim().length < 1) { is_allowed = false; }
		command[1] = command[1].substring(command[1].indexOf("@") + 1, command[1].length);
	}
	if (command[1].indexOf(":") > -1) {
		var port = command[1].substring(command[1].indexOf(":") + 1, command[1].length);
		if (!(allowed_port.indexOf(port) > -1)) {
			is_allowed = false;
		}
		command[1] = command[1].substring(0, command[1].indexOf(":"));
	}
	if (!(allowed_ip.indexOf(command[1]) > -1)) {
		is_allowed = false;
	}
	
	return [is_allowed, user];
	
}

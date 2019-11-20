<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Refresh" content="0; url=/"/>
</head>
<body>
	<h1><a href="/">View Changes</a></h1>
	<?php
	// print_r($_POST);
	// echo "<br>";
	// print_r($_FILES);
	// echo "<br><br><br>";
	chdir("content");	
	if (!file_exists($_POST["stanza"])) {
		mkdir($_POST["stanza"]);
	}
	chdir($_POST["stanza"]); 
	$name = preg_replace('/[^a-zA-Z0-9_]/', '_', $_POST["name"]);
	mkdir($name);
	chdir($name);
	file_put_contents("description.txt", $_POST["desc"]);
	if($_FILES["icon"]["name"] != ""){
		$file_name = $_FILES['icon']['name'];
		$file_tmp = $_FILES['icon']['tmp_name'];
		$file_ext= pathinfo($file_name, PATHINFO_EXTENSION);
		move_uploaded_file($file_tmp,'icon.'.$file_ext);
	}
	var_dump($_FILES["filecontent"]["name"] != "");
	if($_FILES["filecontent"]["name"] != ""){
		// echo "file content: ";
		// print_r($_FILES['filecontent']);
		$file_name = $_FILES['filecontent']['name'];
		$file_tmp =$_FILES['filecontent']['tmp_name'];
		move_uploaded_file($file_tmp,$file_name);
	} 
	if(isset($_POST["linkcontent"])) {
		// echo "link content: ";
		// echo $_POST["linkcontent"];
		file_put_contents("content.txt", $_POST["linkcontent"]);
	}
	if(isset($_POST["caption"])){
		file_put_contents("caption.txt", $_POST["caption"]);
	}
	?>
</body>
</html> 

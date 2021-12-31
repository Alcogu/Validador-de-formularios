<!DOCTYPE html>
<html>
<head>
 
	<title>JSValidator</title>
	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="/js/jsvalidator/css/style.css">

</head>
<body>
 
	<div class="container pt-5">
		
		<form id="myForm" action="{{ route('validation.store') }}" method="POST" enctype="multipart/form-data">
			
			@csrf
 
			<div class="form-group">
				<label>Nombre:</label>
				<input 
					class="form-control jsValidator" 
					type="text" 
					name="name" 
					data-validators="required length" 
					data-validators_minLength="3"
					data-validators_maxLength="255"
					data-validators_length_msg="El texto debe ser de 3 a 255 caracteres">
 
			</div>
 
			<div class="form-group">
				<label>Email:</label>
				<input 
					class="form-control jsValidator" 
					type="text" 
					name="email" 
					data-validators="email">
 
			</div>
 
			<div class="form-group">
				<label>URL:</label>
				<input 
					class="form-control jsValidator" 
					type="text" 
					name="url" 
					data-validators="url">
 
			</div>
 
			<div class="form-group">
				<label>Edad:</label>
				<input 
					class="form-control jsValidator" 
					type="text" 
					name="age"
					data-validators="integer">
			</div>
 
			<div class="form-group">
				<label>Intereses</label>
				<select class="form-control jsValidator" name="interests[]" multiple>
					<option value="1">Interés Uno</option>
					<option value="2">Interés Dos</option>
					<option value="3">Interés Tres</option>
				</select>
			</div>
 
			<div class="form-group">
				<input 
					class="form-control jsValidator"
					type="file" 
					name="file">
			</div>
 
			<div class="form-group">
				<input class="btn btn-primary btn-lg active" type="submit" name="submit" value="Enviar">
			</div>
 
		</form>
 
	</div>
 
	<script src="/js/jsvalidator.min.js"></script>
 
	<script>
 
		const myFormValidator = new JSValidator('myForm').init().setAjax(); 
 
	</script>
 
</body>
</html>
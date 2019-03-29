<?php

$pdf_base64 = "base64.txt";
//Get File content from txt file
$pdf_base64_handler = fopen($pdf_base64,'r');
$pdf_content = fread ($pdf_base64_handler,filesize($pdf_base64));
fclose ($pdf_base64_handler);
//Decode pdf content
$pdf_decoded = base64_decode ($pdf_content);
//Write data back to pdf file
$pdf = fopen ($_GET['namepdf'],'w');
fwrite ($pdf,$pdf_decoded);
//close output file
fclose ($pdf);

$(document).ready( function () {
    $('#myTable').DataTable({ "pageLength": 25, 
    "lengthMenu": [ 10, 25, 50, 75, 100 ],
     "pagingType": "simple_numbers",
     "bSort" : false,
    responsive: true
});
} );

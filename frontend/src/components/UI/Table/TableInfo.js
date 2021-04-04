// import React, { useEffect } from 'react';
// import { Plus } from 'react-feather';
// import { Button, Col, Input, Row } from 'reactstrap';

// const flattenObject = function(ob) {
//   var toReturn = {};
  
//   for (var i in ob) {
//     if (!ob.hasOwnProperty(i)) continue;
    
//     if ((typeof ob[i]) == 'object') {
//       var flatObject = flattenObject(ob[i]);
//       for (var x in flatObject) {
//         if (!flatObject.hasOwnProperty(x)) continue;
        
//         toReturn[x] = flatObject[x];
//         // toReturn[i + '.' + x] = flatObject[x];
//       }
//     } else {
//       toReturn[i] = ob[i];
//     }
//   }

//   return toReturn;
// };

// const TableInfo = ({
//   addButton,
//   message,
//   title,
//   search,
//   records,
//   columnsNames,
//   setTableList,
// }) => {
//   let timer = null;

//   useEffect(() => {
//     return () => {
//       if (timer) clearTimeout(timer);
//     }
//   }, [timer]);

//   return (
//     <>
//       <Row className="mr-2">
//         <Col>
//           <h3 style={{ color: '#515151' }} className="font-weight-bold h5 mb-1">
//             {title}
//           </h3>
//           <p className="text-muted">{message}</p>
//         </Col>
//       </Row>
//       {addButton?.visible && (
//         <Button
//           className="mb-3 width-lg pl-3 pr-3"
//           type="button"
//           color={addButton.color || 'primary'}
//           title={addButton.title}
//           onClick={addButton.onClick}
//         >
//           {addButton.value} <Plus size="16" />
//         </Button>
//       )}
//       {search?.visible && (
//         <Input
//           className="form-control mb-3"
//           style={{ width: '280px' }}
//           type={search?.type || 'text'}
//           placeholder={search?.placeholder || 'Search...'}
//           onKeyUp={(e) => {
//             clearTimeout(timer);

//             const value = e.target.value;

//             // if (value === '') return setTableList(records);

//             timer = setTimeout(() => {
//               const flatted = records?.map((record) => flattenObject(record));
//               // const filtered = [];

//               columnsNames.forEach((cn) => {
//                 flatted?.forEach((record) => {
//                   if (record[cn]?.toLowerCase()?.includes(value?.toLowerCase())) {
//                     console.log()
//                     // filtered.push(record);
//                   }
//                 });
//               });

//               // console.log(filtered);
//               // return setTableList(filtered);
//             }, 700);
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default TableInfo;

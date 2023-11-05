"use client";
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  move,
  swap,
} from "react-grid-dnd";
import Image from "next/image";
import Images from "../api/mockItem1.json";
import Images2 from "../api/mockItem2.json";
import Images3 from "../api/mockItem3.json";
import { AiFillCheckSquare } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";

const Page = () => {
  const [items, setItems] = useState({ Images, Images2, Images3 });
  const [bprCount, setBprCount] = useState(2);
  
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  
  // target id will only be set if dragging from one dropzone to another.
  function onChange(
    sourceId,
    sourceIndex,
    targetIndex,
    targetId,
  ) {
    try {
      if (targetId) {
        const result = move(
          items[sourceId],
          items[targetId],
          sourceIndex,
          targetIndex
        );
        let newTargetResult = [];
        let removedItem = {};
        if (targetId === "Images") {
          const previousTargetItem = items[targetId][0];
          const previousTargetResult = result[1];
          if (items[targetId]?.length !== 0) {
            newTargetResult = previousTargetResult.filter(
              (item) => previousTargetItem.id !== item.id
            );
            const previousSourceResult = result[0];
            previousSourceResult.unshift(previousTargetItem);
          } else {
            const upcomingItem = items[sourceId][sourceIndex];
  
            newTargetResult.push(upcomingItem);
          }
        }
        if (targetId === "Images2") {
          const lastLists = result[1];
          if (lastLists.length > 4) {
            removedItem = lastLists.pop();
            newTargetResult = lastLists;
            const previousSourceResult = result[0];
            previousSourceResult.unshift(removedItem);

          } else {

            removedItem = lastLists.pop();
            newTargetResult = lastLists;
            const previousSourceResult = result[0];
            previousSourceResult.unshift(removedItem);
          }
        }
        if (targetId === "Images3") {
          const lastLists = result[1];

          
          if (lastLists.length > 6) {
            removedItem = lastLists.pop();
            newTargetResult = lastLists;
            const previousSourceResult = result[0];
            previousSourceResult.unshift(removedItem);

          } else {
            removedItem = lastLists.pop();
            newTargetResult = lastLists;
            const previousSourceResult = result[0];
            previousSourceResult.unshift(removedItem);

          }
        }
  
        return setItems({
          ...items,
          [sourceId]: result[0],
          [targetId]:
            targetId === "Images" || targetId === "Images2"
              ? newTargetResult
              : result[1],
        });
      }
  
      const result = swap(items[sourceId], sourceIndex, targetIndex);
      return setItems({
        ...items,
        [sourceId]: result,
      });
    } catch (error) {
      console.log(error)
    }
  }
  const [rowGap2ndBox, setRowGap2ndBox] = useState(220);
  function ScreenSizeLogger() {
    const logScreenSize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth > 1100) {
        setBprCount(4);
        setRowGap2ndBox(220);
        return;
      } else if (screenWidth < 1100 && screenWidth > 900) {
        setBprCount(2);
        setRowGap2ndBox(220);
        return;
      } else if (screenWidth < 900 && screenWidth > 800) {
        setBprCount(2);
        setRowGap2ndBox(220);
        return;
      } else if (screenWidth < 900 && screenWidth > 600) {
        setBprCount(2);
        setRowGap2ndBox(120);
        return;
      }else if (screenWidth < 400) {
        setBprCount(2);
        setRowGap2ndBox(120);
        return;
      }
    };

    useEffect(() => {
      // Initial screen size log
      logScreenSize();

      // Add event listener to detect screen size changes
      window.addEventListener("resize", logScreenSize);

      // Cleanup the event listener when the component unmounts
      return () => {
        window.removeEventListener("resize", logScreenSize);
      };
    }, []);

    return null; // You can return null since this component doesn't render anything
  }
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (item) => {
    if (selectedItems.includes(item.id)) {
      const newArray = selectedItems.filter((x) => x !== item.id);
      setSelectedItems(newArray);
      return;
    } else {
      setSelectedItems([...selectedItems, item.id]);

    }
  };
  // useEffect(() => {
  //   localStorage.setItem("id", JSON.stringify(selectedItems));
  //   selectedItems = localStorage.getItem("id");
  // }, [selectedItems]);
  // console.log(selectedItems)

  const deleteHandle = () => {
    const totalItem = items.Images.length + items.Images2.length+ items.Images3.length;
        if(totalItem === selectedItems.length){
          Toast.fire({
            icon: 'warning',
            title: "Don't be so rude, There will be no item left! 😔😔"
          })
         return;
        }
    for (let index = 0; index < selectedItems.length; index++) {
      const selectedId = selectedItems[index];

      const filteredImages = items.Images.filter(
        (item) => selectedId !== item.id
      );
      items["Images"] = filteredImages;

      const filteredImages2 = items.Images2.filter(
        (item) => selectedId !== item.id
      );

      items["Images2"] = filteredImages2;
      const filteredImages3 = items.Images3.filter(
        (item) => selectedId !== item.id
      );

      items["Images3"] = filteredImages3;
    }
    if (items.Images.length === 0) {
      if(items.Images2.length > 0){
        const removedItem = items.Images2.shift();
        items["Images"].push(removedItem);
      }else {
        const removedItem = items.Images3.shift();
        items["Images"].push(removedItem);
      }
    }

    if (items.Images3.length > 0 && items.Images2.length < 4) {
      const secondBoxNeed = 4 - items.Images2.length;
      const removedItem = items.Images3.splice(0, secondBoxNeed);
      const newArr = items.Images2.concat(removedItem);
      items["Images2"] = newArr;
    }
    // showing toast message 
    Toast.fire({
      icon: 'success',
      title: 'Successfully deleted'
    })
    setSelectedItems([])
    return setItems({
      ...items,
    });
  };


  // const x = [1,5,6]
  return (
    <div className="">
      {bprCount && (
        <div className="w-full mx-auto ">
          <ScreenSizeLogger />
          <GridContextProvider onChange={onChange}>
            <div className="w-3/5 relative mx-auto mt-16">
              <div className="w-full flex lg:flex-row flex-col justify-between lg:items-center items-start my-5">
                {selectedItems?.length > 0 && (
                  <p className="flex justify-start items-center gap-3 my-2">
                    <AiFillCheckSquare className="w-5 h-5 bg-blue-50 text-blue-500" />{" "}
                    Selected Items: {selectedItems?.length}
                  </p>
                )}
                {selectedItems?.length > 0 && (
                  <div
                    onClick={deleteHandle}
                    className="flex justify-start items-center gap-1 my-2 bg-red-500 p-1 text-white rounded-md cursor-pointer"
                  >
                    <BsFillTrashFill /> Delete
                  </div>
                )}
              </div>
              <div className="grid lg:grid-cols-2 md:grid-cols-1 w-full gap-5 relative mx-auto">
                {/* ================First droppable Item zone ===========  */}
               {
                items.Images.length > 0 &&  <GridDropZone
                id="Images"
                boxesPerRow={1}
                rowHeight={1}
                className="md:h-[440px] h-[300px] mr-16 w-full "
              >
                {items?.Images?.map((item, index) => (
                  <GridItem key={item.id}>
                    <div
                      className={`m-1 rounded-md shadow-xl shadow-slate-200 cursor-grab overflow-hidden duration-500`}
                    >
                      <Image
                        src={item.image}
                        alt="item-image"
                        width={500}
                        height={500}
                        className="w-full md:h-[410px] h-[300px]"
                      />
                      <div className="w-full md:h-[410px] h-[300px] bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300"></div>
                      <div className="w-full md:h-[410px] h-[300px] bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300">
                        <input
                          type="checkbox"
                          checked={selectedItems?.includes(item.id)}
                          onChange={() => handleCheckboxChange(item)}
                          className="w-5 h-5 absolute right-3 top-3"
                        />
                      </div>
                    </div>
                  </GridItem>
                ))}
              </GridDropZone>
               }
                {/* ================second droppable Item zone ===========  */}
               {
                items.Images2.length > 0 &&  <GridDropZone
                id="Images2"
                boxesPerRow={2}
                rowHeight={rowGap2ndBox}
                className="lg:h-[410px] md:h-[460px] h-[240px] w-full"
              >
                {items.Images2.map((item, index) => (
                  <GridItem key={item.id}>
                    <div
                      className={`m-0 rounded-md bg-white border border-gray-900 shadow-xl shadow-slate-200 cursor-grab overflow-hidden md:w-[200px] md:h-[200px] w-[100px] h-[100px] relative mt-1`}
                    >
                      <Image
                        src={item.image}
                        alt="item-image"
                        width={500}
                        height={500}
                        className="w-full h-full"
                      />
                      <div className="md:w-[200px] md:h-[200px] w-[100px] h-[100px] bg-transparent  bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300"></div>
                      <div className="md:w-[200px] md:h-[200px] w-[100px] h-[100px] bg-transparent  bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300">
                        <input
                          type="checkbox"
                          checked={selectedItems?.includes(item.id)}
                          onChange={() => handleCheckboxChange(item)}
                          className="w-5 h-5 absolute right-3 top-3"
                        />
                      </div>
                    </div>
                  </GridItem>
                ))}
              </GridDropZone>
               }
              </div>
              {/* ================third droppable Item zone ===========  */}
             {
              items.Images3.length > 0 &&  <GridDropZone
              id="Images3"
              boxesPerRow={bprCount}
              rowHeight={rowGap2ndBox}
              className="h-[410px] w-full lg:ml-2 ml-0"
            >
              {items.Images3.map((item, index) => (
                <GridItem key={item.id}>
                  <div
                    className={`m-0 rounded-md bg-white border border-gray-900 shadow-xl shadow-slate-200 cursor-grab overflow-hidden md:w-[200px] md:h-[200px] w-[100px] h-[100px]`}
                  >
                    <Image
                      src={
                        item.image
                          ? item.image
                          : "https://img.freepik.com/premium-vector/photo-icon-picture-icon-image-sign-symbol-vector-illustration_64749-4409.jpg"
                      }
                      alt="item-image"
                      width={500}
                      height={500}
                      className="w-full h-full"
                    />
                    <div className="md:w-[200px] md:h-[200px] w-[100px] h-[100px] bg-transparent bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300"></div>
                    <div className="md:w-[200px] md:h-[200px] w-[100px] h-[100px] bg-transparent bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300">
                      <input
                        type="checkbox"
                        checked={selectedItems?.includes(item.id)}
                        onChange={() => handleCheckboxChange(item)}
                        className="w-5 h-5 absolute right-3 top-3"
                      />
                    </div>
                  </div>
                </GridItem>
              ))}
            </GridDropZone>
             }
            </div>
          </GridContextProvider>

          {/* <button type="button" onClick={() => 
            State
          </button> */}
        </div>
      )}
    </div>
  );
};

export default Page;

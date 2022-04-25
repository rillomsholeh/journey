import React, { useState, useEffect, Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";
import parse from "html-react-parser";
import Bookmark from "../assets/bookmark.png";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";

import { API } from "../config/api";

export default function Posts() {
  const [post, setPost] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState(4);

  const handleClick = async () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <button onClick={handleClose}>close</button>
    </React.Fragment>
  );

  const getPosts = async () => {
    try {
      const response = await API.get("/posts");
      setPost(response.data.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmark = async (journeyID) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      var id = {
        idJourney: journeyID,
      };

      const body = JSON.stringify(id);
      await API.post("addBookmark", body, config);
    } catch (error) {
      console.log(error);
    }
  };

  const showMore = () => {
    setView((preview) => preview + 4);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <div className="md:mt-10">
        <div className="md:mt-8 md:mb-10">
          <TextField
            className="w-full"
            id="outlined-basic"
            label="Search anything here"
            variant="outlined"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <h2 className="mb-4">All Post</h2>

        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          message="Saved to bookmark."
          action={action}
        />

        <div className="grid grid-cols-4 gap-8 relative">
          {post
            .slice(0, view)
            .filter((items, index) => {
              if (search === "") {
                return items;
              } else if (
                items.title.toLowerCase().includes(search.toLowerCase()) ||
                items.description
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                items.user.name.toLowerCase().includes(search.toLowerCase())
              ) {
                return items;
              }
            })
            .map((items, index) => (
              <div className="relative shadow-lg p-2">
                <div
                  onClick={() => handleBookmark(items.id)}
                  className="absolute z-10 top-48 right-0 cursor-pointer"
                >
                  <img onClick={handleClick} src={Bookmark} alt="" />
                </div>
                <Link key={index} to={`/detail/${items.id}`}>
                  <div>
                    <div>
                      <img
                        src={items.thumbnail}
                        alt=""
                        className="h-44 w-full object-cover"
                      />
                    </div>
                    <div className="md:mt-4">
                      <h3 className="text-xl">{items.title}</h3>
                    </div>
                    <div className="">
                      <p className="text-gray-500">
                        {dateFormat(items.createdAt, "mediumDate")},{" "}
                        {items.user.name}
                      </p>
                    </div>
                    <div className="md:my-4">
                      <p className="line-clamp-3">{parse(items.description)}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
        <div className="flex justify-center items-center md:mt-10 md:mb-10">
          <button
            onClick={showMore}
            className="px-8 py-1 bg-blueSea text-white rounded"
          >
            Show More
          </button>
        </div>
      </div>
    </div>
  );
}

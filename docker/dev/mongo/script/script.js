rs.initiate({
  _id: "rs",
  members: [
    {
      _id: 0,
      host: "mongodb1:27017"
    },
    {
      _id: 1,
      host: "mongodb2:27017"
    },
    {
      _id: 2,
      host: "mongodb3:27017"
    }
  ]
})

cfg = rs.conf()
cfg.members[0].priority = 1
cfg.members[1].priority = 0.5
cfg.members[2].priority = 0.5
rs.reconfig(cfg, {force: true})